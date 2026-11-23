// npm run worktree:remove -- NNNN: stops worktree w-NNNN's servers, runs
// `git worktree remove` and drops its database (W-0090). Run it from any checkout
// except the one being removed.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { currentCheckout, adminDatabaseUrl, worktreePath, type Checkout } from './checkout'
import { WORKTREE_FOLDER, worktreeDatabaseName } from './localEnvironment'
import { dropDatabase, withPostgres } from './postgres'
import { stopServers } from './servers'

await removeWorktree(currentCheckout(), process.argv[2])

async function removeWorktree(checkout: Checkout, worktreeNumber: string | undefined) {
  if (!worktreeNumber || !WORKTREE_FOLDER.test(`w-${worktreeNumber}`)) {
    throw new Error(
      'Usage: npm run worktree:remove -- NNNN   (e.g. 0090 for .claude/worktrees/w-0090)',
    )
  }
  if (checkout.environment.worktreeNumber === worktreeNumber) {
    throw new Error(`This is w-${worktreeNumber}. Run worktree:remove from another checkout.`)
  }

  const folder = worktreePath(checkout, worktreeNumber)
  if (existsSync(folder)) {
    if (await stopServers(folder)) {
      console.log(`Stopped w-${worktreeNumber}'s backend and frontend.`)
    }
    // Without --force, git refuses if the worktree has uncommitted changes, and the
    // database is kept.
    execFileSync('git', ['worktree', 'remove', folder], {
      cwd: checkout.mainRoot,
      stdio: 'inherit',
    })
    console.log(`Removed worktree ${folder}.`)
  } else {
    console.log(`No worktree at ${folder}.`)
  }

  await withPostgres(adminDatabaseUrl(checkout), (client) =>
    dropDatabase(client, worktreeDatabaseName(worktreeNumber)),
  )
}
