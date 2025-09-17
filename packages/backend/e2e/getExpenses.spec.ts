import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expensesTable, expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'
import { ExpensesDbRow } from '../src/models/expense/expense'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../src/models/expenseSubCategory/expenseSubCategory'
import { excludeFieldsAndAdd } from '../src/utilities/excludeFieldsAndAdd'

const BASE_URL = 'http://localhost:3000'

test.describe('Get Expenses Endpoint', () => {
  let fakeExpenseData1: ExpensesDbRow
  let fakeExpenseData2: ExpensesDbRow
  let fakeExpenseDataDifferentAccount: ExpensesDbRow
  let fakeCreatedExpenseCategory: ExpenseCategoryDbRow
  let fakeCreatedExpenseSubCategory: ExpenseSubCategoryDbRow
  let fakeAccountId: string

  test.beforeAll(async () => {
    connectToDb()
    const {
      accountId,
      expenseData1,
      expenseData2,
      expenseDataDifferentAccount,
      createdExpenseCategory,
      createdExpenseSubCategory,
    } = await assignFakeExpenseData()
    fakeAccountId = accountId
    fakeExpenseData1 = expenseData1
    fakeExpenseData2 = expenseData2
    fakeExpenseDataDifferentAccount = expenseDataDifferentAccount
    fakeCreatedExpenseCategory = createdExpenseCategory
    fakeCreatedExpenseSubCategory = createdExpenseSubCategory
  })

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

  test.describe('when get expenses is called successfully', () => {
    test('should return an array of expenses related to the account id provided in descending order based on date', async ({
      request,
    }) => {
      // Insert test expenses directly into database
      const [expense1] = await db.insert(expensesTable).values(fakeExpenseData1).returning()
      const [expense2] = await db.insert(expensesTable).values(fakeExpenseData2).returning()
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
      expect(returnedExpenses[0]).toEqual({
        ...excludeFieldsAndAdd(expense2, ['categoryId', 'subCategoryId']),
        category: {
          ...fakeCreatedExpenseCategory,
          subCategories: [
            {
              ...fakeCreatedExpenseSubCategory,
              createdAt: fakeCreatedExpenseSubCategory.createdAt.toISOString(),
              updatedAt: fakeCreatedExpenseSubCategory.updatedAt.toISOString(),
            },
          ],
          createdAt: fakeCreatedExpenseCategory.createdAt.toISOString(),
          updatedAt: fakeCreatedExpenseCategory.updatedAt.toISOString(),
        },
        subCategory: {
          ...fakeCreatedExpenseSubCategory,
          createdAt: fakeCreatedExpenseSubCategory.createdAt.toISOString(),
          updatedAt: fakeCreatedExpenseSubCategory.updatedAt.toISOString(),
        },
        createdAt: fakeExpenseData2.createdAt.toISOString(),
        updatedAt: fakeExpenseData2.updatedAt.toISOString(),
      })

      expect(returnedExpenses[1]).toEqual({
        ...excludeFieldsAndAdd(expense1, ['categoryId', 'subCategoryId']),
        category: {
          ...fakeCreatedExpenseCategory,
          subCategories: [
            {
              ...fakeCreatedExpenseSubCategory,
              createdAt: fakeCreatedExpenseSubCategory.createdAt.toISOString(),
              updatedAt: fakeCreatedExpenseSubCategory.updatedAt.toISOString(),
            },
          ],
          createdAt: fakeCreatedExpenseCategory.createdAt.toISOString(),
          updatedAt: fakeCreatedExpenseCategory.updatedAt.toISOString(),
        },
        subCategory: {
          ...fakeCreatedExpenseSubCategory,
          createdAt: fakeCreatedExpenseSubCategory.createdAt.toISOString(),
          updatedAt: fakeCreatedExpenseSubCategory.updatedAt.toISOString(),
        },
        createdAt: fakeExpenseData1.createdAt.toISOString(),
        updatedAt: fakeExpenseData1.updatedAt.toISOString(),
      })
    })
  })
})

async function assignFakeExpenseData(): Promise<{
  accountId: string
  expenseData1: any
  expenseData2: any
  expenseDataDifferentAccount: any
  createdExpenseCategory: ExpenseCategoryDbRow
  createdExpenseSubCategory: ExpenseSubCategoryDbRow
}> {
  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  const [createdCategory] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: 'Food',
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

  const fakeExpenseData2 = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Restaurant',
    amount: 50,
    netAmount: 50,
    date: '2025-08-08',
    categoryId: createdCategory.id,
    subCategoryId: createdSubCategory.id,
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeAccountId2 = '00000000-0000-0000-0000-000000000004'

  const fakeExpenseDataDifferentAccount = {
    userId: fakeUserId,
    accountId: fakeAccountId2,
    name: 'Utilities',
    amount: 200,
    netAmount: 180,
    date: '2025-08-09',
    categoryId: createdCategory.id,
    subCategoryId: createdSubCategory.id,
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return {
    accountId: fakeAccountId,
    expenseData1: fakeExpenseData1,
    expenseData2: fakeExpenseData2,
    expenseDataDifferentAccount: fakeExpenseDataDifferentAccount,
    createdExpenseCategory: createdCategory,
    createdExpenseSubCategory: createdSubCategory,
  }
}
