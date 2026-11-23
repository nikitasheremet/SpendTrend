// npm run db:prune: drops every spend_trend_wNNNN database whose .claude/worktrees/w-NNNN
// folder is gone (W-0090), e.g. after a worktree was removed without worktree:remove.
import { existsSync, readdirSync } from 'node:fs'
import { currentCheckout, adminDatabaseUrl, worktreesDir, type Checkout } from './checkout'
import { orphanedWorktreeDatabases } from './orphanedDatabases'
import { dropDatabase, listWorktreeDatabases, withPostgres } from './postgres'

await pruneDatabases(currentCheckout())

async function pruneDatabases(checkout: Checkout) {
  const dir = worktreesDir(checkout)
  const worktreeFolders = existsSync(dir) ? readdirSync(dir) : []

  await withPostgres(adminDatabaseUrl(checkout), async (client) => {
    const orphans = orphanedWorktreeDatabases(await listWorktreeDatabases(client), worktreeFolders)
    if (orphans.length === 0) {
      console.log('No orphaned worktree databases.')
    }
    for (const name of orphans) {
      await dropDatabase(client, name)
    }
  })
}
