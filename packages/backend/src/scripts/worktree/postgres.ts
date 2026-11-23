// Database admin for the shared local Postgres container. Every URL passed in comes from
// localDatabaseUrl, which refuses anything not on localhost.
import pg from 'pg'
import { WORKTREE_DATABASE_PREFIX } from './localEnvironment'

const SAFE_DATABASE_NAME = /^[a-z0-9_]+$/

/** Runs `fn` with a client connected to `databaseUrl`, then disconnects. */
export async function withPostgres<T>(
  databaseUrl: string,
  fn: (client: pg.Client) => Promise<T>,
): Promise<T> {
  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

export async function createDatabaseIfMissing(client: pg.Client, name: string) {
  const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name])
  if (existing.rowCount) return
  await client.query(`CREATE DATABASE ${quoted(name)}`)
  console.log(`Created database ${name}.`)
}

/** Drops `name`, disconnecting anything still connected to it. */
export async function dropDatabase(client: pg.Client, name: string) {
  await client.query(`DROP DATABASE IF EXISTS ${quoted(name)} WITH (FORCE)`)
  console.log(`Dropped database ${name}.`)
}

export async function listWorktreeDatabases(client: pg.Client): Promise<string[]> {
  const result = await client.query<{ datname: string }>(
    'SELECT datname FROM pg_database WHERE starts_with(datname, $1) ORDER BY datname',
    [WORKTREE_DATABASE_PREFIX],
  )
  return result.rows.map((row) => row.datname)
}

// Identifiers can't be query parameters, so only allow names that need no escaping.
function quoted(name: string): string {
  if (!SAFE_DATABASE_NAME.test(name)) {
    throw new Error(`Unexpected database name: ${name}`)
  }
  return `"${name}"`
}
