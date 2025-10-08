import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
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
import {
  createIncomeHandler,
  deleteIncomeHandler,
  getIncomesHandler,
  updateIncomeHandler,
} from './income/handler'

export function createApp() {
  const app = new Hono()

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://nikitasheremet.github.io',
        'https://spendtrend-9fwf.onrender.com',
        'https://spendtrend-mz44.onrender.com',
      ],
      credentials: true,
    }),
  )

  app.use(async (ctx, next) => {
    if (ctx.req.path.startsWith('/api/auth')) {
      console.log('Path', ctx.req.path)
      console.log('Headers', ctx.req.header())
      console.log('Query', ctx.req.query())
      const body = ctx.req.raw.clone()
      if (body) {
        const text = await body.text()
        console.log('Body', text)
      } else {
        console.log('Body is empty')
      }
    }
    await next()
    console.log('Response status:', ctx.res.status)
    console.log('Response headers:', ctx.res.headers)
  })

  app.all('/api/auth/*', (ctx) => auth.handler(ctx.req.raw))

  app.use(async (ctx, next) => {
    if (!ctx.req.path.startsWith('/api/auth')) {
      const session = await auth.api.getSession({
        headers: ctx.req.header(),
      })
      if (!session?.session || new Date() > new Date(session.session.expiresAt)) {
        return ctx.json({ error: 'Unauthorized' }, 401)
      }
    }
    await next()
  })

  app.get('/health', (ctx) => {
    return ctx.json({ status: `ok: ${new Date().toISOString()}` }, 200)
  })

  app.post('/createexpense', createExpenseHandler)
  app.post('/createexpensecategory', createExpenseCategoryHandler)
  app.post('/createexpensesubcategory', createExpenseSubCategoryHandler)
  app.put('/updateexpensesubcategory', updateExpenseSubCategoryHandler)
  app.post('/deleteexpensesubcategory', deleteExpenseSubCategoryHandler)
  app.get('/expenses', getExpensesHandler)
  app.put('/updateexpense', updateExpenseHandler)
  app.get('/getexpensecategories', getExpenseCategoriesHandler)
  app.post('/deleteexpensecategory', deleteExpenseCategoryHandler)
  app.put('/updateexpensecategory', updateExpenseCategoryHandler)
  app.post('/deleteexpense', deleteExpenseHandler)
  app.post('/createincome', createIncomeHandler)
  app.post('/deleteincome', deleteIncomeHandler)
  app.get('/incomes', getIncomesHandler)
  app.put('/updateincome', updateIncomeHandler)

  return app
}
