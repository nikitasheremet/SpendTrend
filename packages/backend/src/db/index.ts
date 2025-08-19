import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import dotenv from 'dotenv'
import path from 'path'
import * as schema from './schema'

dotenv.config({ path: path.resolve(__dirname, '../../env/.env.local') })

let db: NodePgDatabase<typeof schema>

export function connectToDb() {
  if (!db) {
    db = drizzle({ connection: process.env.DATABASE_URL!, schema: schema })
  }
  return db
}

export { db }
