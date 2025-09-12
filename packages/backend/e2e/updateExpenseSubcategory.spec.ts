import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { DB_ERROR } from '../src/models/errors/repositoryErrors'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import { UpdateExpenseSubcategoryInput } from '../src/expenseSubCategories/validation/models'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../src/models/expenseSubCategory/expenseSubCategory'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Expense Subcategory Endpoint', () => {
  let createdExpenseCategory: ExpenseCategoryDbRow
  let createdExpenseSubcategory: ExpenseSubCategoryDbRow
  let fakeUpdateExpenseSubcategoryInput: UpdateExpenseSubcategoryInput

  test.beforeAll(async () => {
    const testData = await setupTestData()
    createdExpenseCategory = testData.expenseCategory
    createdExpenseSubcategory = testData.expenseSubcategory
    fakeUpdateExpenseSubcategoryInput = testData.updateInput
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code for missing fields', async ({
      request,
    }) => {
      const fakeBadValidationData = {}
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeBadValidationData,
        },
      )
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })

    test('should return error message and 422 status code for invalid UUID', async ({
      request,
    }) => {
      const fakeInvalidData = {
        ...fakeUpdateExpenseSubcategoryInput,
        userId: 'invalid-uuid',
      }
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeInvalidData,
        },
      )
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })

    test('should return error message and 422 status code for empty name', async ({ request }) => {
      const fakeInvalidData = {
        ...fakeUpdateExpenseSubcategoryInput,
        name: '',
      }
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeInvalidData,
        },
      )
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when subcategory does not exist', () => {
    test('should return a 500 error with not found message', async ({ request }) => {
      const fakeNonExistentId = crypto.randomUUID()
      const response = await request.put(`${BASE_URL}/expense-subcategories/${fakeNonExistentId}`, {
        data: fakeUpdateExpenseSubcategoryInput,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body.error).toContain('not found')
    })
  })

  test.describe('when subcategory belongs to different user', () => {
    test('should return a 500 error with unauthorized message', async ({ request }) => {
      const fakeUnauthorizedData = {
        ...fakeUpdateExpenseSubcategoryInput,
        userId: crypto.randomUUID(), // Different user ID
      }
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeUnauthorizedData,
        },
      )
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body.error).toContain('Unauthorized')
    })
  })

  test.describe('when subcategory belongs to different account', () => {
    test('should return a 500 error with unauthorized message', async ({ request }) => {
      const fakeUnauthorizedData = {
        ...fakeUpdateExpenseSubcategoryInput,
        accountId: crypto.randomUUID(), // Different account ID
      }
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeUnauthorizedData,
        },
      )
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body.error).toContain('Unauthorized')
    })
  })

  test.describe('when valid expense subcategory update data is provided', () => {
    test('should update the expense subcategory and return the updated subcategory object', async ({
      request,
    }) => {
      const response = await request.put(
        `${BASE_URL}/expense-subcategories/${createdExpenseSubcategory.id}`,
        {
          data: fakeUpdateExpenseSubcategoryInput,
        },
      )

      expect(response.status()).toBe(STATUS_SUCCESS_200)

      const body = await response.json()
      const { expenseSubCategory } = body
      expect(expenseSubCategory).toEqual(
        expect.objectContaining({
          id: createdExpenseSubcategory.id,
          userId: fakeUpdateExpenseSubcategoryInput.userId,
          accountId: fakeUpdateExpenseSubcategoryInput.accountId,
          categoryId: createdExpenseSubcategory.categoryId, // Should remain unchanged
          name: fakeUpdateExpenseSubcategoryInput.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )

      // Verify the name was actually updated
      expect(expenseSubCategory.name).toBe(fakeUpdateExpenseSubcategoryInput.name)
      expect(expenseSubCategory.name).not.toBe(createdExpenseSubcategory.name)
    })
  })
})

async function setupTestData(): Promise<{
  expenseCategory: ExpenseCategoryDbRow
  expenseSubcategory: ExpenseSubCategoryDbRow
  updateInput: UpdateExpenseSubcategoryInput
}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  // Create a test expense category
  const [createdCategory] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: `Test Category for Update-${Math.random()}`,
    })
    .returning()

  // Create a test expense subcategory
  const [createdSubcategory] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      categoryId: createdCategory.id,
      name: `Original Subcategory Name-${Math.random()}`,
    })
    .returning()

  const updateInput: UpdateExpenseSubcategoryInput = {
    subCategoryId: createdSubcategory.id,
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: `Updated Subcategory Name-${Math.random()}`,
  }

  return {
    expenseCategory: createdCategory,
    expenseSubcategory: createdSubcategory,
    updateInput,
  }
}
