import Koa from 'koa'
import Router from '@koa/router'
import dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import { createExpenseHandler, getExpensesHandler } from './expense/handler/'
import { connectToDb } from './db'

dotenv.config({ path: path.resolve(__dirname, '../env/.env.local') })
connectToDb()

const PORT = process.env.PORT || 3000

const app = new Koa()
const router = new Router()

router.get('/health', (ctx) => {
  ctx.status = 200
  ctx.body = { status: `ok: ${new Date().toISOString()}` }
})

router.post('/createexpense', createExpenseHandler)
router.get('/expenses', getExpensesHandler)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
