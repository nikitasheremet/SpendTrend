import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { eq } from 'drizzle-orm'
import { expenseCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe.skip('Update Expense Category Endpoint', () => {
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
      // First, create a category
      const inserted = await db.insert(expenseCategoriesTable).values(fakeValidCategory).returning()
      const createdCategory = inserted[0]

      // Update the name and subcategories
      const updatePayload = {
        id: createdCategory.id,
        userId: createdCategory.userId,
        accountId: createdCategory.accountId,
        name: 'Updated Category Name',
        subcategories: ['Updated Subcategory 1', 'Updated Subcategory 2'],
      }
      const response = await request.put(`${BASE_URL}/updateexpensecategory`, {
        data: updatePayload,
      })
      const body = await response.json()

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      expect(body.expenseCategory.name).toBe(updatePayload.name)
      expect(body.expenseCategory.id).toBe(createdCategory.id)

      // Verify in DB
      const rows = await db
        .select()
        .from(expenseCategoriesTable)
        .where(eq(expenseCategoriesTable.id, createdCategory.id))
      expect(rows.length).toBe(1)
      expect(rows[0].name).toBe(updatePayload.name)
      expect(rows[0].subcategories).toEqual(updatePayload.subcategories)
    })

    test('should update subcategories and return the updated expenseCategory', async ({
      request,
    }) => {
      // First, create a category
      const inserted = await db.insert(expenseCategoriesTable).values(fakeValidCategory).returning()
      const createdCategory = inserted[0]

      // Update the subcategories
      const updatePayload = {
        id: createdCategory.id,
        userId: createdCategory.userId,
        accountId: createdCategory.accountId,
        subcategories: ['New Sub1', 'New Sub2'],
      }

      const response = await request.put(`${BASE_URL}/updateexpensecategory`, {
        data: updatePayload,
      })
      const body = await response.json()

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      expect(body.expenseCategory.subcategories).toEqual(updatePayload.subcategories)
      expect(body.expenseCategory.id).toBe(createdCategory.id)

      // Verify in DB
      const rows = await db
        .select()
        .from(expenseCategoriesTable)
        .where(eq(expenseCategoriesTable.id, createdCategory.id))
      expect(rows.length).toBe(1)
      expect(rows[0].subcategories).toEqual(updatePayload.subcategories)
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
