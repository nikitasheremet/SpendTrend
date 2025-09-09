import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { eq, and } from 'drizzle-orm'
import { expenseCategoriesTable } from '../src/db/schema'
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
    subcategories: ['Flights', 'Hotels'],
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

  test.describe('when request is successful', () => {
    test('should delete the expense category and return the deleted category', async ({
      request,
    }) => {
      // Create a category directly in the database
      const [createdCategory] = await db
        .insert(expenseCategoriesTable)
        .values(fakeValidCategory)
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
      expect(deleteBody.expenseCategory.id).toBe(createdCategory.id)
      expect(deleteBody.expenseCategory.name).toBe(fakeValidCategory.name)

      // Verify it no longer exists in DB
      const rowsAfterDelete = await db
        .select()
        .from(expenseCategoriesTable)
        .where(eq(expenseCategoriesTable.id, createdCategory.id))
      expect(rowsAfterDelete.length).toBe(0)
    })
  })
})
