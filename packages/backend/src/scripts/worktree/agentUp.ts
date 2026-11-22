// npm run agent:up: runs the full app for this checkout on its own ports and database
// (W-0090). Creates the database if missing, migrates it, creates the local user
// (ADR-0004), then starts both servers in the background. npm run agent:down stops them.
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import {
  adminDatabaseUrl,
  currentCheckout,
  ensureEnvFiles,
  localDatabaseUrl,
  type Checkout,
} from './checkout'
import { createDatabaseIfMissing, withPostgres } from './postgres'
import {
  backendUrl,
  frontendUrl,
  logPath,
  serversAreRunning,
  startServers,
  stopServers,
} from './servers'

await agentUp(currentCheckout())

async function agentUp(checkout: Checkout) {
  const { environment } = checkout
  if (serversAreRunning(checkout.root)) {
    console.log('Already running. npm run agent:down stops it.')
    printUrls(checkout)
    return
  }
  // One server died: stop the other so both start fresh.
  await stopServers(checkout.root)

  ensureEnvFiles(checkout)
  run('docker', ['compose', 'up', '-d', '--wait'], checkout.root, {})
  await withPostgres(adminDatabaseUrl(checkout), (client) =>
    createDatabaseIfMissing(client, environment.databaseName),
  )

  const databaseUrl = localDatabaseUrl(checkout, environment.databaseName)
  const backendDir = path.join(checkout.root, 'packages', 'backend')
  run('npx', ['drizzle-kit', 'migrate'], backendDir, { DATABASE_URL: databaseUrl })
  run('npm', ['run', 'local:user'], backendDir, { DATABASE_URL: databaseUrl })

  console.log('Starting the backend and frontend...')
  await startServers(checkout.root, databaseUrl)
  printUrls(checkout)
}

function run(command: string, args: string[], cwd: string, env: Record<string, string>) {
  execFileSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })
}

function printUrls(checkout: Checkout) {
  const { environment } = checkout
  console.log(
    [
      `Frontend: ${frontendUrl(environment)}`,
      `Backend:  ${backendUrl(environment)}`,
      `Database: ${environment.databaseName}`,
      `Logs:     ${logPath(checkout.root, 'backend')}, ${logPath(checkout.root, 'frontend')}`,
      'Sign in:  npm run local:signin',
    ].join('\n'),
  )
}
