// The checkout (main or worktree) a script runs from, and the env it needs (W-0090).
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { isLocalDatabaseUrl } from '../../lib/localDatabaseUrl'
import { localEnvironmentFor, WORKTREES_DIR, type LocalEnvironment } from './localEnvironment'

export interface Checkout {
  root: string
  /** The main checkout, which owns `.claude/worktrees/` and the real env files. */
  mainRoot: string
  environment: LocalEnvironment
}

// Gitignored, so a fresh worktree doesn't have them.
const ENV_FILES = [
  'packages/backend/env/.env.local',
  'packages/backend/env/.env.local.notsafe',
  'packages/frontend/.env.local',
]
const BACKEND_ENV_FILE = ENV_FILES[0]

/** The checkout this script file lives in. */
export function currentCheckout(): Checkout {
  const root = path.resolve(import.meta.dirname, '../../../../..')
  return { root, mainRoot: mainCheckoutRoot(root), environment: localEnvironmentFor(root) }
}

/** Copies the gitignored env files a worktree is missing from the main checkout. */
export function ensureEnvFiles(checkout: Checkout) {
  for (const file of ENV_FILES) {
    const target = path.join(checkout.root, file)
    if (existsSync(target)) continue
    const source = path.join(checkout.mainRoot, file)
    if (!existsSync(source)) {
      throw new Error(
        `${file} is missing. Create it in ${checkout.mainRoot} (see packages/backend/env/example).`,
      )
    }
    copyFileSync(source, target)
    console.log(`Copied ${file} from the main checkout.`)
  }
}

/**
 * The main checkout's DATABASE_URL pointed at `databaseName`. Throws unless it is on
 * localhost, so these scripts can never create or drop a remote database.
 */
export function localDatabaseUrl(checkout: Checkout, databaseName: string): string {
  const envFile = path.join(checkout.mainRoot, BACKEND_ENV_FILE)
  const { DATABASE_URL } = dotenv.parse(readFileSync(envFile))
  if (!isLocalDatabaseUrl(DATABASE_URL)) {
    throw new Error(`DATABASE_URL in ${envFile} is not on localhost or 127.0.0.1. Refusing.`)
  }
  const url = new URL(DATABASE_URL)
  url.pathname = `/${databaseName}`
  return url.toString()
}

/** The `postgres` maintenance database, for creating and dropping the others. */
export function adminDatabaseUrl(checkout: Checkout): string {
  return localDatabaseUrl(checkout, 'postgres')
}

export function worktreesDir(checkout: Checkout): string {
  return path.join(checkout.mainRoot, WORKTREES_DIR)
}

export function worktreePath(checkout: Checkout, worktreeNumber: string): string {
  return path.join(worktreesDir(checkout), `w-${worktreeNumber}`)
}

function mainCheckoutRoot(root: string): string {
  const commonGitDir = execFileSync(
    'git',
    ['rev-parse', '--path-format=absolute', '--git-common-dir'],
    { cwd: root, encoding: 'utf8' },
  ).trim()
  return path.dirname(commonGitDir)
}
