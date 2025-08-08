import { drizzle } from 'drizzle-orm/node-postgres'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../env/.env.local') })

let db: ReturnType<typeof drizzle>

export function connectToDb() {
  if (!db) {
    db = drizzle({ connection: process.env.DATABASE_URL! })
  }
  return db
}

export { db }
