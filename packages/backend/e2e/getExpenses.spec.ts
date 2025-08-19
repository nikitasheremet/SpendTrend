import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expensesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe('Get Expenses Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })
  const fakeAccountId = crypto.randomUUID()
  const fakeExpenseData1 = {
    userId: '00000000-0000-0000-0000-000000000001',
    accountId: fakeAccountId,
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-07',
    category: 'Food',
    subCategory: 'Supermarket',
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeExpenseData2 = {
    userId: '00000000-0000-0000-0000-000000000001',
    accountId: fakeAccountId,
    name: 'Restaurant',
    amount: 50,
    netAmount: 50,
    date: '2025-08-08',
    category: 'Food',
    subCategory: 'Dining Out',
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeExpenseDataDifferentAccount = {
    userId: '00000000-0000-0000-0000-000000000003',
    accountId: '00000000-0000-0000-0000-000000000004',
    name: 'Utilities',
    amount: 200,
    netAmount: 180,
    date: '2025-08-09',
    category: 'Bills',
    subCategory: 'Electricity',
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      // Missing or invalid userId
      const response = await request.get(`${BASE_URL}/expenses`, {
        params: { userId: '' },
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe('when internal server error occurs', () => {
    test('should return error message and 500 status code', async ({ request }) => {
      // Simulate an internal server error by providing an invalid accountId
      const response = await request.get(`${BASE_URL}/expenses`, {
        params: { userId: '00000000-0000-0000-0000-000000000001', accountId: 'invalid-account-id' },
      })
      expect(response.status()).toBe(500)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when get expenses is called successfully', () => {
    test('should return an array of expenses related to the account id provided in descending order based on date', async ({
      request,
    }) => {
      // Insert test expenses directly into database
      const [expense1] = await db.insert(expensesTable).values(fakeExpenseData1).returning()
      const [expense2] = await db.insert(expensesTable).values(fakeExpenseData2).returning()
      console.log(expense1.id, expense2.id)
      await db.insert(expensesTable).values(fakeExpenseDataDifferentAccount)

      // Get expenses
      const response = await request.get(`${BASE_URL}/expenses`, {
        params: { userId: fakeExpenseData1.userId, accountId: fakeAccountId },
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body).toHaveProperty('expenses')

      // Only 2 expenses that match the account id are returned
      expect(body.expenses.length).toEqual(2)

      // Verify the created expenses are in the response
      const returnedExpenses = body.expenses
      expect(returnedExpenses[0]).toEqual(
        expect.objectContaining({
          id: expense2.id,
          userId: fakeExpenseData2.userId,
          accountId: fakeAccountId,
          name: fakeExpenseData2.name,
          amount: fakeExpenseData2.amount,
          netAmount: fakeExpenseData2.netAmount,
          date: fakeExpenseData2.date,
          category: fakeExpenseData2.category,
          subCategory: fakeExpenseData2.subCategory,
          paidBackAmount: fakeExpenseData2.paidBackAmount,
          createdAt: fakeExpenseData2.createdAt.toISOString(),
          updatedAt: fakeExpenseData2.updatedAt.toISOString(),
        }),
      )
      expect(returnedExpenses[1]).toEqual(
        expect.objectContaining({
          id: expense1.id,
          userId: fakeExpenseData1.userId,
          accountId: fakeAccountId,
          name: fakeExpenseData1.name,
          amount: fakeExpenseData1.amount,
          netAmount: fakeExpenseData1.netAmount,
          date: fakeExpenseData1.date,
          category: fakeExpenseData1.category,
          subCategory: fakeExpenseData1.subCategory,
          paidBackAmount: fakeExpenseData1.paidBackAmount,
          createdAt: fakeExpenseData1.createdAt.toISOString(),
          updatedAt: fakeExpenseData1.updatedAt.toISOString(),
        }),
      )
    })
  })
})
