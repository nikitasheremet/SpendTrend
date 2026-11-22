// Email and password sign-in exists only so agents can sign in to a locally running
// backend without Google (ADR-0004). This guard is security-critical: if it lets a
// deployed environment through, that environment accepts password sign-ins.
import { isLocalDatabaseUrl } from './localDatabaseUrl'

/**
 * True only when NODE_ENV is exactly `local`. Throws when NODE_ENV is `local` but
 * DATABASE_URL doesn't point at localhost, so the backend refuses to start rather
 * than open password sign-in on a remote database.
 */
export function isLocalPasswordSignInEnabled(env: NodeJS.ProcessEnv): boolean {
  if (env.NODE_ENV !== 'local') {
    return false
  }
  if (!isLocalDatabaseUrl(env.DATABASE_URL)) {
    throw new Error(
      'NODE_ENV is local, which turns on password sign-in, but DATABASE_URL is not on localhost or 127.0.0.1. Refusing to start.',
    )
  }
  return true
}
