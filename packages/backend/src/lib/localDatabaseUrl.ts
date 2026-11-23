// What counts as a local database. Shared by the password sign-in guard (ADR-0004) and
// the worktree scripts that create and drop databases (W-0090), so both stay in step.
// Security-critical: the guard relies on it to keep password sign-in off remote databases.

const LOCAL_DATABASE_HOSTS = ['localhost', '127.0.0.1']

/** True only when `databaseUrl` parses and its host is localhost or 127.0.0.1. */
export function isLocalDatabaseUrl(databaseUrl: string | undefined): boolean {
  if (!databaseUrl || !URL.canParse(databaseUrl)) {
    return false
  }
  return LOCAL_DATABASE_HOSTS.includes(new URL(databaseUrl).hostname)
}
