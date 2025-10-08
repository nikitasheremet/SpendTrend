import { betterAuth, type Auth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import { user, session, account, verification } from '../db/schema'
import { customSession } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'

export let auth: Auth

export function createAuth() {
  auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.BETTER_AUTH_URL!,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
      database: {
        generateId: false,
      },
    },
    trustedOrigins: ['http://localhost:5173', 'https://nikitasheremet.github.io'],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [
      customSession(async ({ user, session }) => {
        const accountDetails = await db.select().from(account).where(eq(account.userId, user.id))
        return {
          user: {
            ...user,
            accountId: accountDetails[0].id,
          },
          session,
        }
      }),
    ],
  })
}
