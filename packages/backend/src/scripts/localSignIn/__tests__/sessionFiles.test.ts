import { toCurlCookieJar, toPlaywrightStorageState } from '../sessionFiles'

const NOW = new Date('2026-11-20T00:00:00Z')
const NOW_SECONDS = 1795132800
const SESSION_COOKIE =
  'better-auth.session_token=abc123.sig%3D; Max-Age=604800; Path=/; HttpOnly; Secure; SameSite=None'

describe('toPlaywrightStorageState', () => {
  it('turns a Set-Cookie header into a cookie for the backend host', () => {
    const state = toPlaywrightStorageState([SESSION_COOKIE], 'http://localhost:3000', NOW)

    expect(state).toEqual({
      cookies: [
        {
          name: 'better-auth.session_token',
          value: 'abc123.sig%3D',
          domain: 'localhost',
          path: '/',
          expires: NOW_SECONDS + 604800,
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        },
      ],
      origins: [],
    })
  })
})

describe('toCurlCookieJar', () => {
  it('writes the cookies in Netscape cookie jar format', () => {
    const state = toPlaywrightStorageState(
      [SESSION_COOKIE, 'theme=dark; Path=/settings; SameSite=Lax'],
      'http://localhost:3000',
      NOW,
    )

    expect(toCurlCookieJar(state).split('\n')).toEqual([
      '# Netscape HTTP Cookie File',
      `#HttpOnly_localhost\tFALSE\t/\tTRUE\t${NOW_SECONDS + 604800}\tbetter-auth.session_token\tabc123.sig%3D`,
      'localhost\tFALSE\t/settings\tFALSE\t0\ttheme\tdark',
      '',
    ])
  })
})
