import { test, expect } from '@playwright/test'
import { STATUS_SUCCESS_200, STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expensesTable, expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'
import { excludeFieldsAndAdd } from '../src/utilities/excludeFieldsAndAdd'
import { ExpensesDbRow } from '../src/models/expense/expense'

const BASE_URL = 'http://localhost:3000'

test.describe('Delete Expense Endpoint', () => {
  let fakeExpenseData1: ExpensesDbRow
  let fakeExpenseId: string
  let fakeCategory: any
  let fakeSubCategory: any

  test.beforeAll(async () => {
    connectToDb()
    const { expenseId, expenseData1, category, subCategory } = await assignFakeExpenseData()
    fakeExpenseId = expenseId
    fakeExpenseData1 = expenseData1
    fakeCategory = category
    fakeSubCategory = subCategory
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      // Missing or invalid expenseId
      const response = await request.post(`${BASE_URL}/deleteexpense`, {
        params: { expenseId: '' },
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe('when a non-existent expense is deleted', () => {
    test('should return error message and 404 status code', async ({ request }) => {
      // Simulate an internal server error by providing an invalid accountId
      const response = await request.post(`${BASE_URL}/deleteexpense`, {
        data: {
          userId: crypto.randomUUID(),
          accountId: crypto.randomUUID(),
          expenseId: crypto.randomUUID(),
        },
      })
      expect(response.status()).toBe(404)
      const body = await response.json()
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })

  test.describe('when the expense is deleted successfully', () => {
    test('should return the expense related to the expense id', async ({ request }) => {
      // Insert test expenses directly into database
      const [insertedExpense] = await db.insert(expensesTable).values(fakeExpenseData1).returning()

      // Send DELETE request
      const response = await request.post(`${BASE_URL}/deleteexpense`, {
        data: {
          userId: insertedExpense.userId,
          accountId: insertedExpense.accountId,
          expenseId: insertedExpense.id,
        },
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body.expense).toEqual({
        ...excludeFieldsAndAdd(insertedExpense, ['categoryId', 'subCategoryId']),
        category: {
          ...fakeCategory,
          subCategories: [
            {
              ...fakeSubCategory,
              createdAt: fakeSubCategory.createdAt.toISOString(),
              updatedAt: fakeSubCategory.updatedAt.toISOString(),
            },
          ],
          createdAt: fakeCategory.createdAt.toISOString(),
          updatedAt: fakeCategory.updatedAt.toISOString(),
        },
        subCategory: {
          ...fakeSubCategory,
          createdAt: fakeSubCategory.createdAt.toISOString(),
          updatedAt: fakeSubCategory.updatedAt.toISOString(),
        },
        createdAt: insertedExpense.createdAt.toISOString(),
        updatedAt: insertedExpense.updatedAt.toISOString(),
      })
    })
  })
})

async function assignFakeExpenseData(): Promise<{
  expenseId: string
  expenseData1: any
  category: any
  subCategory: any
}> {
  const fakeExpenseId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()
  const fakeAccountId = crypto.randomUUID()

  const [createdCategory] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: 'Sample Category',
    })
    .returning()

  const [createdSubCategory] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      categoryId: createdCategory.id,
      name: 'Groceries',
    })
    .returning()

  const fakeExpenseData1 = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    id: fakeExpenseId,
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-07',
    categoryId: createdCategory.id,
    subCategoryId: createdSubCategory.id,
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return {
    expenseId: fakeExpenseId,
    expenseData1: fakeExpenseData1,
    category: createdCategory,
    subCategory: createdSubCategory,
  }
}
