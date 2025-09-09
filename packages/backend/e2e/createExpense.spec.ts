import { test, expect } from '@playwright/test'
import {
  STATUS_CREATED_201,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { DB_ERROR } from '../src/models/errors/repositoryErrors'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import { CreateExpenseInput } from '../src/expense/validation/models'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../src/models/expenseSubCategory/expenseSubCategory'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Expense Endpoint', () => {
  let createdExpenseCategory: ExpenseCategoryDbRow
  let createdExpenseSubCategory: ExpenseSubCategoryDbRow
  let fakeCreateExpenseInput: CreateExpenseInput

  test.beforeAll(async () => {
    const { createExpenseInput, expenseCategory, expenseSubCategory } =
      await assignFakeCreateExpenseInputAndExpenseCategory()
    fakeCreateExpenseInput = createExpenseInput
    createdExpenseCategory = expenseCategory
    createdExpenseSubCategory = expenseSubCategory
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe('when internal server error occurs', () => {
    test('should return error message and 500 status code', async ({ request }) => {
      const fakeBadValidationData = JSON.parse(JSON.stringify(fakeCreateExpenseInput))
      fakeBadValidationData.userId = 'invalid-uuid'

      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe("when an expense with a expenseCategory Id that doesn't exist is created", () => {
    test('should return a 500 error and a DB_ERROR message', async ({ request }) => {
      const fakeExpenseDataWithInvalidCategory = JSON.parse(JSON.stringify(fakeCreateExpenseInput))
      fakeExpenseDataWithInvalidCategory.categoryId = crypto.randomUUID()

      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeExpenseDataWithInvalidCategory,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body.error).toContain(DB_ERROR)
    })
  })
  test.describe('when valid expense data is provided', () => {
    test('should create a new expense and return the expense object', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeCreateExpenseInput,
      })

      expect(response.status()).toBe(STATUS_CREATED_201)
      const body = await response.json()
      expect(body).toHaveProperty('id')
      expect(body).toEqual(
        expect.objectContaining({
          name: fakeCreateExpenseInput.name,
          userId: fakeCreateExpenseInput.userId,
          accountId: fakeCreateExpenseInput.accountId,
          paidBackAmount: fakeCreateExpenseInput.paidBackAmount,
          amount: fakeCreateExpenseInput.amount,
          netAmount: fakeCreateExpenseInput.netAmount,
          date: fakeCreateExpenseInput.date,
          category: {
            id: createdExpenseCategory.id,
            userId: createdExpenseCategory.userId,
            accountId: createdExpenseCategory.accountId,
            name: createdExpenseCategory.name,
            subCategories: [
              {
                id: createdExpenseSubCategory.id,
                userId: createdExpenseSubCategory.userId,
                accountId: createdExpenseSubCategory.accountId,
                categoryId: createdExpenseSubCategory.categoryId,
                name: createdExpenseSubCategory.name,
                createdAt: createdExpenseSubCategory.createdAt.toISOString(),
                updatedAt: createdExpenseSubCategory.updatedAt.toISOString(),
              },
            ],
            createdAt: createdExpenseCategory.createdAt.toISOString(),
            updatedAt: createdExpenseCategory.updatedAt.toISOString(),
          },
          subCategory: {
            id: createdExpenseSubCategory.id,
            userId: createdExpenseSubCategory.userId,
            accountId: createdExpenseSubCategory.accountId,
            categoryId: createdExpenseSubCategory.categoryId,
            name: createdExpenseSubCategory.name,
            createdAt: createdExpenseSubCategory.createdAt.toISOString(),
            updatedAt: createdExpenseSubCategory.updatedAt.toISOString(),
          },
        }),
      )
    })
  })
})

async function assignFakeCreateExpenseInputAndExpenseCategory(): Promise<{
  createExpenseInput: CreateExpenseInput
  expenseCategory: ExpenseCategoryDbRow
  expenseSubCategory: ExpenseSubCategoryDbRow
}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

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

  const createExpenseInput = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-07',
    categoryId: createdCategory.id,
    subCategoryId: createdSubCategory.id,
    paidBackAmount: 0,
  }

  return {
    createExpenseInput,
    expenseCategory: createdCategory,
    expenseSubCategory: createdSubCategory,
  }
}
