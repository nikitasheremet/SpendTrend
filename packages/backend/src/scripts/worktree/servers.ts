// Starts and stops a checkout's backend and frontend in the background. Their pids and
// logs live in <checkout>/.agent-env/, so agent:down and worktree:remove can find them.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import path from 'node:path'
import { localEnvironmentFor, type LocalEnvironment } from './localEnvironment'

type Workspace = 'backend' | 'frontend'

interface RunningServers {
  backendPid: number
  frontendPid: number
}

const STATE_DIR = '.agent-env'
const STATE_FILE = 'servers.json'
const STARTUP_TIMEOUT_MS = 90_000
const SHUTDOWN_TIMEOUT_MS = 10_000

export function backendUrl(environment: LocalEnvironment): string {
  return `http://localhost:${environment.backendPort}`
}

export function frontendUrl(environment: LocalEnvironment): string {
  return `http://localhost:${environment.frontendPort}`
}

/** Both servers agent:up started are still alive. */
export function serversAreRunning(checkoutRoot: string): boolean {
  const servers = readRunningServers(checkoutRoot)
  return servers !== undefined && [servers.backendPid, servers.frontendPid].every(isAlive)
}

/** Starts both servers on the checkout's ports and waits until both answer. */
export async function startServers(checkoutRoot: string, databaseUrl: string) {
  const environment = localEnvironmentFor(checkoutRoot)
  for (const url of [backendUrl(environment), frontendUrl(environment)]) {
    if (await answers(url)) {
      throw new Error(`Something is already listening on ${url}. Stop it first.`)
    }
  }
  mkdirSync(stateDir(checkoutRoot), { recursive: true })

  const backendPid = startInBackground(checkoutRoot, 'backend', ['run', 'local'], {
    NODE_ENV: 'local',
    BACKEND_PORT: String(environment.backendPort),
    DATABASE_URL: databaseUrl,
    BETTER_AUTH_URL: backendUrl(environment),
  })
  const frontendPid = startInBackground(
    checkoutRoot,
    'frontend',
    ['run', 'dev', '--', '--port', String(environment.frontendPort), '--strictPort'],
    {
      VITE_BACKEND_URL: backendUrl(environment),
      VITE_CALLBACK_URL: frontendUrl(environment),
    },
  )
  writeFileSync(statePath(checkoutRoot), JSON.stringify({ backendPid, frontendPid }, null, 2))

  try {
    await waitUntilAnswering(backendUrl(environment), logPath(checkoutRoot, 'backend'))
    await waitUntilAnswering(frontendUrl(environment), logPath(checkoutRoot, 'frontend'))
  } catch (error) {
    await stopServers(checkoutRoot)
    throw error
  }
}

/** Stops the servers agent:up started for this checkout, if any. */
export async function stopServers(checkoutRoot: string): Promise<boolean> {
  const servers = readRunningServers(checkoutRoot)
  if (!servers) return false
  const pids = [servers.backendPid, servers.frontendPid]
  pids.forEach((pid) => signalGroup(pid, 'SIGTERM'))

  const deadline = Date.now() + SHUTDOWN_TIMEOUT_MS
  while (pids.some(isAlive) && Date.now() < deadline) {
    await sleep(200)
  }
  pids.filter(isAlive).forEach((pid) => signalGroup(pid, 'SIGKILL'))
  rmSync(statePath(checkoutRoot), { force: true })
  return true
}

export function logPath(checkoutRoot: string, workspace: Workspace): string {
  return path.join(stateDir(checkoutRoot), `${workspace}.log`)
}

function startInBackground(
  checkoutRoot: string,
  workspace: Workspace,
  npmArgs: string[],
  env: Record<string, string>,
): number {
  const log = openSync(logPath(checkoutRoot, workspace), 'w')
  // detached puts the server in its own process group, so it outlives this script and
  // stopServers can signal npm and everything it started at once.
  const child = spawn('npm', npmArgs, {
    cwd: path.join(checkoutRoot, 'packages', workspace),
    env: { ...process.env, ...env },
    detached: true,
    stdio: ['ignore', log, log],
  })
  child.unref()
  if (child.pid === undefined) {
    throw new Error(`Could not start the ${workspace}.`)
  }
  return child.pid
}

async function waitUntilAnswering(url: string, logPath: string) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (await answers(url)) return
    await sleep(500)
  }
  throw new Error(`${url} didn't start within ${STARTUP_TIMEOUT_MS / 1000}s. See ${logPath}.`)
}

/** Any HTTP response counts: the backend answers 401 to everything without a session. */
async function answers(url: string): Promise<boolean> {
  try {
    await fetch(url, { signal: AbortSignal.timeout(1000) })
    return true
  } catch {
    return false
  }
}

function readRunningServers(checkoutRoot: string): RunningServers | undefined {
  const file = statePath(checkoutRoot)
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as RunningServers) : undefined
}

function signalGroup(pid: number, signal: NodeJS.Signals) {
  try {
    process.kill(-pid, signal)
  } catch {
    // Already gone.
  }
}

function isAlive(pid: number): boolean {
  try {
    process.kill(-pid, 0)
    return true
  } catch {
    return false
  }
}

function stateDir(checkoutRoot: string): string {
  return path.join(checkoutRoot, STATE_DIR)
}

function statePath(checkoutRoot: string): string {
  return path.join(stateDir(checkoutRoot), STATE_FILE)
}
