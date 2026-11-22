// Creates the local user in the database DATABASE_URL points at. Safe to re-run.
// Usage: npm run local:user   (or DATABASE_URL=... npm run local:user for another local DB)
//
// Signs up through better-auth, so the normal account hook gives the user the default
// expense categories. better-auth only allows that when the local password sign-in guard
// passes: NODE_ENV=local and a localhost DATABASE_URL.
import { eq } from 'drizzle-orm'
import { connectToDb } from '../db'
import { user } from '../db/schema'
import { auth, createAuth } from '../lib/auth'
import { LOCAL_USER } from './localUser'

await createLocalUser()

async function createLocalUser() {
  const db = connectToDb()
  createAuth()

  const existing = await db.select().from(user).where(eq(user.email, LOCAL_USER.email))
  if (existing.length > 0) {
    console.log(`Local user ${LOCAL_USER.email} already exists.`)
  } else {
    await auth.api.signUpEmail({ body: LOCAL_USER })
    console.log(`Created local user ${LOCAL_USER.email}.`)
  }
  // The db pool keeps the process alive.
  process.exit(0)
}
