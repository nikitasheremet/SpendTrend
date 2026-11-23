// Which worktree databases `npm run db:prune` drops: every spend_trend_wNNNN with no
// matching .claude/worktrees/w-NNNN folder. The main database is never a candidate.
import { WORKTREE_DATABASE_PREFIX, WORKTREE_FOLDER, worktreeDatabaseName } from './localEnvironment'

const WORKTREE_DATABASE = new RegExp(`^${WORKTREE_DATABASE_PREFIX}\\d{4}$`)

export function orphanedWorktreeDatabases(
  databaseNames: string[],
  worktreeFolderNames: string[],
): string[] {
  const liveDatabases = new Set(
    worktreeFolderNames
      .map((folder) => WORKTREE_FOLDER.exec(folder)?.[1])
      .filter((worktreeNumber) => worktreeNumber !== undefined)
      .map(worktreeDatabaseName),
  )
  return databaseNames.filter((name) => WORKTREE_DATABASE.test(name) && !liveDatabases.has(name))
}
