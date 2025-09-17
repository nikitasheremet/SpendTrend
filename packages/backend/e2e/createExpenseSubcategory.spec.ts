import { test, expect } from '@playwright/test'
import {
  STATUS_CREATED_201,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { DB_ERROR } from '../src/models/errors/repositoryErrors'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable } from '../src/db/schema'
import { CreateExpenseSubCategoryInput } from '../src/expenseSubCategories/validation/models'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Expense Subcategory Endpoint', () => {
  let createdExpenseCategory: ExpenseCategoryDbRow
  let fakeCreateExpenseSubcategoryInput: CreateExpenseSubCategoryInput

  test.beforeAll(async () => {
    const { createSubcategoryInput, expenseCategory } =
      await assignFakeCreateExpenseSubcategoryInputAndExpenseCategory()
    fakeCreateExpenseSubcategoryInput = createSubcategoryInput
    createdExpenseCategory = expenseCategory
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code for missing fields', async ({
      request,
    }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/createsubcategory`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe("when a subcategory with a categoryId that doesn't exist is created", () => {
    test('should return a 500 error and a DB_ERROR message', async ({ request }) => {
      const fakeSubcategoryDataWithInvalidCategory = {
        ...fakeCreateExpenseSubcategoryInput,
        categoryId: crypto.randomUUID(),
      }

      const response = await request.post(`${BASE_URL}/createsubcategory`, {
        data: fakeSubcategoryDataWithInvalidCategory,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body.error).toContain(DB_ERROR)
    })
  })

  test.describe('when valid expense subcategory data is provided', () => {
    test('should create a new expense subcategory and return the subcategory object', async ({
      request,
    }) => {
      const response = await request.post(`${BASE_URL}/createsubcategory`, {
        data: fakeCreateExpenseSubcategoryInput,
      })

      expect(response.status()).toBe(STATUS_CREATED_201)

      const body = await response.json()
      const { expenseSubCategory } = body
      expect(expenseSubCategory).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userId: fakeCreateExpenseSubcategoryInput.userId,
          accountId: fakeCreateExpenseSubcategoryInput.accountId,
          categoryId: fakeCreateExpenseSubcategoryInput.categoryId,
          name: fakeCreateExpenseSubcategoryInput.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )
    })
  })

  test.describe('when duplicate subcategory name is used for the same category', () => {
    test('should return a 500 error due to unique constraint violation', async ({ request }) => {
      const fakeCreateSubCategory = {
        ...fakeCreateExpenseSubcategoryInput,
        name: `Duplicate Subcategory-${Math.random()}`,
      }
      // Create first subcategory
      const firstResponse = await request.post(`${BASE_URL}/createsubcategory`, {
        data: fakeCreateSubCategory,
      })
      expect(firstResponse.status()).toBe(STATUS_CREATED_201)

      // Try to create another subcategory with the same name and categoryId
      const duplicateResponse = await request.post(`${BASE_URL}/createsubcategory`, {
        data: fakeCreateSubCategory,
      })
      expect(duplicateResponse.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)

      const body = await duplicateResponse.json()
      expect(body.error).toContain(DB_ERROR)
    })
  })
})

async function assignFakeCreateExpenseSubcategoryInputAndExpenseCategory(): Promise<{
  createSubcategoryInput: CreateExpenseSubCategoryInput
  expenseCategory: ExpenseCategoryDbRow
}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  const [createdCategory] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: `Sample Category for Subcategories-${Math.random()}`,
    })
    .returning()

  const createSubcategoryInput: CreateExpenseSubCategoryInput = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    categoryId: createdCategory.id,
    name: `Sample Subcategory-${Math.random()}`,
  }

  return {
    createSubcategoryInput,
    expenseCategory: createdCategory,
  }
}
