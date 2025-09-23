import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import {
  deleteExpenseHandler,
  createExpenseHandler,
  getExpensesHandler,
  updateExpenseHandler,
} from './expense/handler/'
import {
  createExpenseCategoryHandler,
  getExpenseCategoriesHandler,
  deleteExpenseCategoryHandler,
  updateExpenseCategoryHandler,
} from './expenseCategories/handler'
import {
  createExpenseSubCategoryHandler,
  updateExpenseSubCategoryHandler,
  deleteExpenseSubCategoryHandler,
} from './expenseSubCategories/handler'
import { connectToDb } from './db'
import { createIncomeHandler } from './income/handler'

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
router.post('/createsubcategory', createExpenseSubCategoryHandler)
router.put('/updateexpensesubcategory', updateExpenseSubCategoryHandler)
router.post('/deleteexpensesubcategory', deleteExpenseSubCategoryHandler)
router.get('/expenses', getExpensesHandler)
router.put('/updateexpense', updateExpenseHandler)
router.get('/getexpensecategories', getExpenseCategoriesHandler)
router.delete('/deleteexpensecategory', deleteExpenseCategoryHandler)
router.put('/updateexpensecategory', updateExpenseCategoryHandler)
router.post('/deleteexpense', deleteExpenseHandler)
router.post('/createincome', createIncomeHandler)

app.use(bodyParser())
app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
