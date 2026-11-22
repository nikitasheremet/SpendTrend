// Turns the Set-Cookie headers from a sign-in response into the two files agents use:
// Playwright storage state (a headless browser starts signed in) and a curl cookie jar.

export interface PlaywrightCookie {
  name: string
  value: string
  domain: string
  path: string
  /** Unix seconds, or -1 for a session cookie. */
  expires: number
  httpOnly: boolean
  secure: boolean
  sameSite: 'Strict' | 'Lax' | 'None'
}

export interface PlaywrightStorageState {
  cookies: PlaywrightCookie[]
  origins: []
}

export function toPlaywrightStorageState(
  setCookieHeaders: string[],
  backendUrl: string,
  now: Date,
): PlaywrightStorageState {
  const domain = new URL(backendUrl).hostname
  return {
    cookies: setCookieHeaders.map((header) => parseSetCookie(header, domain, now)),
    origins: [],
  }
}

/** Netscape format, which `curl -b <file>` reads. HttpOnly cookies get curl's `#HttpOnly_` prefix. */
export function toCurlCookieJar(state: PlaywrightStorageState): string {
  const lines = state.cookies.map((cookie) =>
    [
      cookie.httpOnly ? `#HttpOnly_${cookie.domain}` : cookie.domain,
      'FALSE',
      cookie.path,
      cookie.secure ? 'TRUE' : 'FALSE',
      cookie.expires === -1 ? 0 : cookie.expires,
      cookie.name,
      cookie.value,
    ].join('\t'),
  )
  return ['# Netscape HTTP Cookie File', ...lines, ''].join('\n')
}

function parseSetCookie(header: string, defaultDomain: string, now: Date): PlaywrightCookie {
  const [nameValue, ...attributeParts] = header.split(';').map((part) => part.trim())
  const separator = nameValue.indexOf('=')
  const cookie: PlaywrightCookie = {
    name: nameValue.slice(0, separator),
    value: nameValue.slice(separator + 1),
    domain: defaultDomain,
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  }

  for (const part of attributeParts) {
    const [rawKey, ...rest] = part.split('=')
    const key = rawKey.toLowerCase()
    const value = rest.join('=')
    if (key === 'max-age') {
      cookie.expires = Math.floor(now.getTime() / 1000) + Number(value)
    } else if (key === 'path') {
      cookie.path = value
    } else if (key === 'httponly') {
      cookie.httpOnly = true
    } else if (key === 'secure') {
      cookie.secure = true
    } else if (key === 'samesite') {
      cookie.sameSite = toSameSite(value)
    }
  }
  return cookie
}

function toSameSite(value: string): PlaywrightCookie['sameSite'] {
  const lower = value.toLowerCase()
  if (lower === 'strict') return 'Strict'
  if (lower === 'none') return 'None'
  return 'Lax'
}
