import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable, expenseSubCategoriesTable, expensesTable } from '../src/db/schema'
import { DeleteExpenseSubCategoryInput } from '../src/expenseSubCategories/validation/models'
import { ExpenseCategoryDbRow } from '../src/models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../src/models/expenseSubCategory/expenseSubCategory'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'
import { eq } from 'drizzle-orm'

const BASE_URL = 'http://localhost:3000'

test.describe('Delete Expense Subcategory Endpoint', () => {
  let createdExpenseCategory: ExpenseCategoryDbRow
  let createdExpenseSubcategory: ExpenseSubCategoryDbRow
  let fakeDeleteExpenseSubcategoryInput: DeleteExpenseSubCategoryInput
  let expenseId: string

  test.beforeAll(async () => {
    const testData = await setupTestData()
    createdExpenseCategory = testData.expenseCategory
    createdExpenseSubcategory = testData.expenseSubcategory
    fakeDeleteExpenseSubcategoryInput = testData.deleteInput
    expenseId = testData.expenseId
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code for missing fields', async ({
      request,
    }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/deleteexpensesubcategory`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when subcategory does not exist', () => {
    test('should return a 404 error with not found message', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/deleteexpensesubcategory`, {
        data: {
          ...fakeDeleteExpenseSubcategoryInput,
          subCategoryId: crypto.randomUUID(),
        },
      })
      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })

  test.describe('when valid expense subcategory delete data is provided', () => {
    test('should delete the expense subcategory and return the deleted subcategory object', async ({
      request,
    }) => {
      const response = await request.post(`${BASE_URL}/deleteexpensesubcategory`, {
        data: fakeDeleteExpenseSubcategoryInput,
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)

      const body = await response.json()
      expect(body.deletedExpenseSubCategory).toEqual(
        expect.objectContaining({
          id: createdExpenseSubcategory.id,
          userId: fakeDeleteExpenseSubcategoryInput.userId,
          accountId: fakeDeleteExpenseSubcategoryInput.accountId,
          categoryId: createdExpenseCategory.id,
          name: createdExpenseSubcategory.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )

      // Verify the subcategory was actually deleted
      const remainingSubcategories = await db
        .select()
        .from(expenseSubCategoriesTable)
        .where(eq(expenseSubCategoriesTable.id, createdExpenseSubcategory.id))

      expect(remainingSubcategories.length).toBe(0)

      // Verify the expense that referenced the subcategory now has subCategoryId set to null
      const updatedExpense = await db
        .select()
        .from(expensesTable)
        .where(eq(expensesTable.id, expenseId))
        .limit(1)

      expect(updatedExpense.length).toBe(1)
      expect(updatedExpense[0].subCategoryId).toBeNull()
    })
  })
})

async function setupTestData(): Promise<{
  expenseCategory: ExpenseCategoryDbRow
  expenseSubcategory: ExpenseSubCategoryDbRow
  deleteInput: DeleteExpenseSubCategoryInput
  expenseId: string
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
      name: `Test Category for Delete-${Math.random()}`,
    })
    .returning()

  // Create a test expense subcategory
  const [createdSubcategory] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      categoryId: createdCategory.id,
      name: `Subcategory to Delete-${Math.random()}`,
    })
    .returning()

  // Create an expense that references the subcategory
  const [createdExpense] = await db
    .insert(expensesTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: `Test Expense with SubCategory-${Math.random()}`,
      amount: 1000, // $10.00
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      paidBackAmount: 0,
      categoryId: createdCategory.id,
      subCategoryId: createdSubcategory.id, // Reference the subcategory we're going to delete
      netAmount: 1000, // Same as amount since paidBackAmount is 0
    })
    .returning()

  const deleteInput: DeleteExpenseSubCategoryInput = {
    subCategoryId: createdSubcategory.id,
    userId: fakeUserId,
    accountId: fakeAccountId,
  }

  return {
    expenseCategory: createdCategory,
    expenseSubcategory: createdSubcategory,
    deleteInput,
    expenseId: createdExpense.id,
  }
}
