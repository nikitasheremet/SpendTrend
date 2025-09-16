import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { eq } from 'drizzle-orm'
import { expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Expense Category Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })

  const fakeAccountId = crypto.randomUUID()
  const fakeValidCategory = {
    userId: crypto.randomUUID(),
    accountId: fakeAccountId,
    name: `Category-${Math.random()}`,
    subcategories: ['Flights', 'Hotels'],
  }

  test.describe('when input is invalid', () => {
    test('should return a 422 status code for empty object', async ({ request }) => {
      const badPayload = {}
      const response = await request.put(`${BASE_URL}/updateexpensecategory`, {
        data: badPayload,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when request is successful', () => {
    test('should return the updated expenseCategory', async ({ request }) => {
      // First, create a category, setting the createdAt manually otherwise the test runs so fast that the updatedAt after the update is too close and comparison fails
      const inserted = await db
        .insert(expenseCategoriesTable)
        .values({ ...fakeValidCategory, createdAt: new Date(Date.now() - 1000) })
        .returning()
      const createdCategory = inserted[0]

      // Create a subcategory for the category
      const fakeSubCategory = {
        userId: createdCategory.userId,
        accountId: createdCategory.accountId,
        name: 'Test Subcategory',
        categoryId: createdCategory.id,
      }
      const [createdSubCategory] = await db
        .insert(expenseSubCategoriesTable)
        .values(fakeSubCategory)
        .returning()

      // Update the name
      const updatePayload = {
        id: createdCategory.id,
        userId: createdCategory.userId,
        accountId: createdCategory.accountId,
        name: 'Updated Category Name',
      }

      const response = await request.put(`${BASE_URL}/updateexpensecategory`, {
        data: updatePayload,
      })
      const body = await response.json()

      expect(response.status()).toBe(STATUS_SUCCESS_200)

      const expectedExpenseCategory = {
        name: updatePayload.name,
        id: createdCategory.id,
        userId: createdCategory.userId,
        accountId: createdCategory.accountId,
        createdAt: createdCategory.createdAt.toISOString(),
        updatedAt: expect.any(String),
        subCategories: [
          {
            ...createdSubCategory,
            createdAt: createdSubCategory.createdAt.toISOString(),
            updatedAt: createdSubCategory.updatedAt.toISOString(),
          },
        ],
      }
      expect(body.expenseCategory).toEqual(expectedExpenseCategory)

      expect(
        new Date(body.expenseCategory.updatedAt) > new Date(body.expenseCategory.createdAt),
      ).toBe(true)

      // Verify update in DB
      const rows = await db
        .select()
        .from(expenseCategoriesTable)
        .where(eq(expenseCategoriesTable.id, createdCategory.id))
      expect(rows.length).toBe(1)
      expect(rows[0].name).toBe(updatePayload.name)
    })
  })

  test.describe('when updating a non-existent category', () => {
    test('should return 404 when the category id does not exist', async ({ request }) => {
      const updatePayload = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        accountId: crypto.randomUUID(),
        name: 'Non-existent',
      }

      const response = await request.put(`${BASE_URL}/updateexpensecategory`, {
        data: updatePayload,
      })

      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
})
