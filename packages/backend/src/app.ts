import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
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
import { createFailedPasteReportHandlers } from './failedPasteReport/handler/createFailedPasteReportHandler'
import { type SessionUser } from './models/sessionUser'

// e2e runs skip auth, so endpoints that read the session get this fixed user instead.
const TEST_SESSION_USER: SessionUser = {
  id: '00000000-0000-4000-8000-000000000001',
  accountId: '00000000-0000-4000-8000-000000000002',
}

export function createApp() {
  const app = new Hono()

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://nikitasheremet.github.io',
        'https://spendtrend-9fwf.onrender.com',
        'https://spendtrend-mz44.onrender.com',
        'https://dev-spendtrend-frontend.onrender.com',
      ],
      credentials: true,
      // So the frontend can tell a rate-limited user how long to wait.
      exposeHeaders: ['Retry-After'],
    }),
  )

  app.all('/api/auth/*', (ctx) => auth.handler(ctx.req.raw))

  app.use(async (ctx, next) => {
    if (process.env.NODE_ENV === 'test') {
      ctx.set('sessionUser', TEST_SESSION_USER)
      await next()
      return
    }

    if (!ctx.req.path.startsWith('/api/auth')) {
      const session = await auth.api.getSession({
        headers: ctx.req.header(),
      })
      if (!session?.session || new Date() > new Date(session.session.expiresAt)) {
        return ctx.json({ error: 'Unauthorized' }, 401)
      }
      // accountId is added by the customSession plugin, which the Auth type doesn't know about.
      const sessionUser = session.user as typeof session.user & { accountId: string }
      ctx.set('sessionUser', { id: sessionUser.id, accountId: sessionUser.accountId })
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
  app.post('/createfailedpastereport', ...createFailedPasteReportHandlers)

  return app
}
