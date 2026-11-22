// The frontend origins the backend accepts, for CORS and for better-auth's trustedOrigins.
// With NODE_ENV=local any http://localhost:<port> is accepted too, so each worktree's
// frontend can run on its own port (W-0090).

const FRONTEND_ORIGINS = [
  'http://localhost:5173',
  'https://nikitasheremet.github.io',
  'https://spendtrend-mz44.onrender.com',
  'https://dev-spendtrend-frontend.onrender.com',
]

// Allowed by CORS but not trusted by better-auth.
const CORS_ONLY_ORIGINS = ['https://spendtrend-9fwf.onrender.com']

const LOCALHOST_ORIGIN = /^http:\/\/localhost:\d+$/
const LOCALHOST_ORIGIN_PATTERN = 'http://localhost:*'

type OriginEnv = { NODE_ENV?: string }

/** For CORS: whether the backend answers requests from `origin`. */
export function isAllowedOrigin(origin: string, env: OriginEnv): boolean {
  if (FRONTEND_ORIGINS.includes(origin) || CORS_ONLY_ORIGINS.includes(origin)) {
    return true
  }
  return env.NODE_ENV === 'local' && LOCALHOST_ORIGIN.test(origin)
}

/** For better-auth, which matches `*` patterns itself. */
export function trustedOrigins(env: OriginEnv): string[] {
  return env.NODE_ENV === 'local'
    ? [...FRONTEND_ORIGINS, LOCALHOST_ORIGIN_PATTERN]
    : [...FRONTEND_ORIGINS]
}
