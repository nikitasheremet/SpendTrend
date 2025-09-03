import Koa from 'koa'
import Router from '@koa/router'
import dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import { createExpenseHandler, getExpensesHandler, updateExpenseHandler } from './expense/handler/'
import {
  createExpenseCategoryHandler,
  getExpenseCategoriesHandler,
  deleteExpenseCategoryHandler,
} from './expenseCategories/handler'
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
router.post('/createexpensecategory', createExpenseCategoryHandler)
router.get('/expenses', getExpensesHandler)
router.put('/updateexpense', updateExpenseHandler)
router.get('/getexpensecategories', getExpenseCategoriesHandler)
router.delete('/deleteexpensecategory', deleteExpenseCategoryHandler)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
