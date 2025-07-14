import Koa from 'koa'
import Router from '@koa/router'
import { drizzle } from 'drizzle-orm/node-postgres'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../env/.env.local') })

const db = drizzle(process.env.DATABASE_URL!)
console.log('Database URL:', process.env.DATABASE_URL)

const PORT = process.env.PORT || 3000

const app = new Koa()
const router = new Router()

router.get('/health', (ctx) => {
  ctx.status = 200
  ctx.body = { status: `ok: ${new Date().toISOString()}` }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
