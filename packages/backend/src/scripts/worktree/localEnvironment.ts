// Where a checkout's local app runs, so several worktrees can run it at once (W-0090).
// Worktree `.claude/worktrees/w-NNNN` gets frontend port 20000+N, backend port 30000+N
// and database spend_trend_wNNNN. The main checkout keeps the usual 5173, 3000, spend_trend.
import path from 'node:path'

export interface LocalEnvironment {
  /** `NNNN` from `w-NNNN`, or undefined for the main checkout. */
  worktreeNumber: string | undefined
  frontendPort: number
  backendPort: number
  databaseName: string
}

export const MAIN_DATABASE_NAME = 'spend_trend'
export const WORKTREE_DATABASE_PREFIX = `${MAIN_DATABASE_NAME}_w`
export const WORKTREES_DIR = path.join('.claude', 'worktrees')

export const WORKTREE_FOLDER = /^w-(\d{4})$/

export function localEnvironmentFor(checkoutRoot: string): LocalEnvironment {
  const worktreeNumber = worktreeNumberOf(checkoutRoot)
  if (worktreeNumber === undefined) {
    return {
      worktreeNumber,
      frontendPort: 5173,
      backendPort: 3000,
      databaseName: MAIN_DATABASE_NAME,
    }
  }
  const n = Number(worktreeNumber)
  return {
    worktreeNumber,
    frontendPort: 20000 + n,
    backendPort: 30000 + n,
    databaseName: worktreeDatabaseName(worktreeNumber),
  }
}

export function worktreeDatabaseName(worktreeNumber: string): string {
  return `${WORKTREE_DATABASE_PREFIX}${worktreeNumber}`
}

/** `NNNN` when `folder` is `.../.claude/worktrees/w-NNNN`, otherwise undefined. */
function worktreeNumberOf(folder: string): string | undefined {
  const resolved = path.resolve(folder)
  if (!path.dirname(resolved).endsWith(path.sep + WORKTREES_DIR)) {
    return undefined
  }
  return WORKTREE_FOLDER.exec(path.basename(resolved))?.[1]
}
