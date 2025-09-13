import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import { UpdateExpenseSubCategoryInput } from '../src/expenseSubCategories/validation/models'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../src/models/expenseSubCategory/expenseSubCategory'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Expense Subcategory Endpoint', () => {
  let createdExpenseCategory: ExpenseCategoryDbRow
  let createdExpenseSubcategory: ExpenseSubCategoryDbRow
  let fakeUpdateExpenseSubcategoryInput: UpdateExpenseSubCategoryInput

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
      const response = await request.put(`${BASE_URL}/updateexpensesubcategory`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when subcategory does not exist', () => {
    test('should return a 404 error with not found message', async ({ request }) => {
      const response = await request.put(`${BASE_URL}/updateexpensesubcategory`, {
        data: { ...fakeUpdateExpenseSubcategoryInput, subCategoryId: crypto.randomUUID() },
      })
      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })

  test.describe('when valid expense subcategory update data is provided', () => {
    test('should update the expense subcategory and return the updated subcategory object', async ({
      request,
    }) => {
      const response = await request.put(`${BASE_URL}/updateexpensesubcategory`, {
        data: fakeUpdateExpenseSubcategoryInput,
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)

      const body = await response.json()
      expect(body.updatedExpenseSubCategory).toEqual(
        expect.objectContaining({
          id: createdExpenseSubcategory.id,
          userId: fakeUpdateExpenseSubcategoryInput.userId,
          accountId: fakeUpdateExpenseSubcategoryInput.accountId,
          categoryId: createdExpenseSubcategory.categoryId,
          name: fakeUpdateExpenseSubcategoryInput.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )

      // Verify the name was actually updated
      expect(body.updatedExpenseSubCategory.name).toBe(fakeUpdateExpenseSubcategoryInput.name)
      expect(body.updatedExpenseSubCategory.name).not.toBe(createdExpenseSubcategory.name)
    })
  })
})

async function setupTestData(): Promise<{
  expenseCategory: ExpenseCategoryDbRow
  expenseSubcategory: ExpenseSubCategoryDbRow
  updateInput: UpdateExpenseSubCategoryInput
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

  const updateInput: UpdateExpenseSubCategoryInput = {
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
