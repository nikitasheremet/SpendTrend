import dotenv from 'dotenv'
import path from 'path'
import { defineConfig } from 'drizzle-kit'

getEnvConfig()

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})

function getEnvConfig() {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
  dotenv.config({ path: path.resolve(__dirname, `./env/${envFile}`) })
}
