// Signs in as the local user through better-auth's email sign-in endpoint and saves the
// session for agents (ADR-0004):
//   <outDir>/storage-state.json  Playwright storage state: browser.newContext({ storageState })
//   <outDir>/cookies.txt         curl cookie jar: curl -b <outDir>/cookies.txt ...
//
// Usage: npm run local:signin [-- <outDir>]   (default outDir: packages/backend/.agent-auth)
// The backend must be running with NODE_ENV=local. BACKEND_URL (default http://localhost:3000)
// picks the backend and FRONTEND_URL (default http://localhost:5173) the Origin header.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { LOCAL_USER } from '../localUser'
import { toCurlCookieJar, toPlaywrightStorageState } from './sessionFiles'

const DEFAULT_OUT_DIR = path.resolve(import.meta.dirname, '../../../.agent-auth')

await signInAsLocalUser({
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  outDir: path.resolve(process.argv[2] ?? DEFAULT_OUT_DIR),
})

async function signInAsLocalUser(options: {
  backendUrl: string
  frontendUrl: string
  outDir: string
}) {
  const response = await fetch(new URL('/api/auth/sign-in/email', options.backendUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: options.frontendUrl },
    body: JSON.stringify({ email: LOCAL_USER.email, password: LOCAL_USER.password }),
  })
  if (!response.ok) {
    throw new Error(
      `Sign-in as ${LOCAL_USER.email} failed: ${response.status} ${await response.text()}. ` +
        'Is the backend running with NODE_ENV=local, and has `npm run local:user` created the user?',
    )
  }

  const storageState = toPlaywrightStorageState(
    response.headers.getSetCookie(),
    options.backendUrl,
    new Date(),
  )
  await mkdir(options.outDir, { recursive: true })
  const storageStatePath = path.join(options.outDir, 'storage-state.json')
  const cookieJarPath = path.join(options.outDir, 'cookies.txt')
  await writeFile(storageStatePath, JSON.stringify(storageState, null, 2))
  await writeFile(cookieJarPath, toCurlCookieJar(storageState))
  console.log(`Signed in as ${LOCAL_USER.email}.\n  ${storageStatePath}\n  ${cookieJarPath}`)
}
