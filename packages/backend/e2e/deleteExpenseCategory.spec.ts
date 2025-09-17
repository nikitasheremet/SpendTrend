import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { eq  } from 'drizzle-orm'
import { expenseCategoriesTable, expenseSubCategoriesTable, expensesTable } from '../src/db/schema'
import crypto from 'crypto'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'

const BASE_URL = 'http://localhost:3000'

test.describe('Delete Expense Category Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()
  const fakeValidCategory = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: `Category-${Math.random()}`,
  }

  test.describe('when input is invalid', () => {
    test('should return a 422 status code and a validation failure', async ({ request }) => {
      const badPayload = {}
      const response = await request.delete(`${BASE_URL}/deleteexpensecategory`, {
        data: badPayload,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when expense category does not exist', () => {
    test('should return a 404 status code and NOT_FOUND_ERROR', async ({ request }) => {
      const nonExistentId = crypto.randomUUID()
      const deletePayload = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        id: nonExistentId,
      }
      const response = await request.delete(`${BASE_URL}/deleteexpensecategory`, {
        data: deletePayload,
      })
      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })

  test.describe('when no expenses contain the category id to be deleted', () => {
    test('should delete the expense category, cascade delete the subCategories and return the deleted category', async ({
      request,
    }) => {
      // Create a category directly in the database
      const [createdCategory] = await db
        .insert(expenseCategoriesTable)
        .values(fakeValidCategory)
        .returning()

      // Create a subcategory for the category
      const fakeSubCategory = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        name: `SubCategory-${Math.random()}`,
        categoryId: createdCategory.id,
      }
      const [createdSubCategory] = await db
        .insert(expenseSubCategoriesTable)
        .values(fakeSubCategory)
        .returning()

      // Delete the category
      const deletePayload = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        id: createdCategory.id,
      }
      const deleteResponse = await request.delete(`${BASE_URL}/deleteexpensecategory`, {
        data: deletePayload,
      })
      const deleteBody = await deleteResponse.json()

      expect(deleteResponse.status()).toBe(STATUS_SUCCESS_200)

      // Verify the response contains the correct expense category with subcategory
      expect(deleteBody.expenseCategory).toEqual({
        ...createdCategory,
        subCategories: [
          {
            ...createdSubCategory,
            updatedAt: createdSubCategory.updatedAt.toISOString(),
            createdAt: createdSubCategory.createdAt.toISOString(),
          },
        ],
        updatedAt: createdCategory.updatedAt.toISOString(),
        createdAt: createdCategory.createdAt.toISOString(),
      })

      // Verify category no longer exists in DB
      const categoryRowsAfterDelete = await db
        .select()
        .from(expenseCategoriesTable)
        .where(eq(expenseCategoriesTable.id, createdCategory.id))
      expect(categoryRowsAfterDelete.length).toBe(0)

      // Verify subcategory was also cascade deleted
      const subCategoryRowsAfterDelete = await db
        .select()
        .from(expenseSubCategoriesTable)
        .where(eq(expenseSubCategoriesTable.id, createdSubCategory.id))
      expect(subCategoryRowsAfterDelete.length).toBe(0)
    })
  })

  test.describe('when an expense contains the category id to be deleted', () => {
    test('should return a 500 status code with database error', async ({ request }) => {
      // Create a category directly in the database
      const [createdCategory] = await db
        .insert(expenseCategoriesTable)
        .values(fakeValidCategory)
        .returning()

      // Create an expense that uses the category
      const fakeExpense = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        name: `Expense-${Math.random()}`,
        amount: 100,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        paidBackAmount: 0,
        categoryId: createdCategory.id,
        netAmount: 100,
      }
      await db.insert(expensesTable).values(fakeExpense)

      // Try to delete the category
      const deletePayload = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        id: createdCategory.id,
      }
      const deleteResponse = await request.delete(`${BASE_URL}/deleteexpensecategory`, {
        data: deletePayload,
      })

      expect(deleteResponse.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const deleteBody = await deleteResponse.json()
      expect(deleteBody).toHaveProperty('error')
    })
  })
})
