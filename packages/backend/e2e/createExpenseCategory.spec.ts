import { test, expect } from '@playwright/test'
import {
  STATUS_CREATED_201,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { eq, and } from 'drizzle-orm'
import { expenseCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'
import { DB_ERROR } from '../src/models/errors/repositoryErrors'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Expense Category Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })

  const fakeAccountId = crypto.randomUUID()
  const fakeValidCategory = {
    userId: crypto.randomUUID(),
    accountId: fakeAccountId,
    name: `Category-${Math.random()}`,
  }

  test.describe('when input is invalid', () => {
    test('should return a 422 status code and a validation failure', async ({ request }) => {
      const badPayload = {}
      const response = await request.post(`${BASE_URL}/createexpensecategory`, {
        data: badPayload,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when request is successful', () => {
    test('should return the created expenseCategory', async ({ request }) => {
      // Call endpoint
      const response = await request.post(`${BASE_URL}/createexpensecategory`, {
        data: fakeValidCategory,
      })
      const body = await response.json()

      expect(response.status()).toBe(STATUS_CREATED_201)
      expect(body.expenseCategory).toEqual({
        id: expect.any(String),
        userId: fakeValidCategory.userId,
        accountId: fakeValidCategory.accountId,
        name: fakeValidCategory.name,
        subCategories: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })

      // Verify directly in DB that the category was created
      const rows = await db
        .select()
        .from(expenseCategoriesTable)
        .where(
          and(
            eq(expenseCategoriesTable.name, fakeValidCategory.name),
            eq(expenseCategoriesTable.accountId, fakeValidCategory.accountId),
          ),
        )
      expect(rows.length).toBe(1)
      expect(rows[0]).toEqual(
        expect.objectContaining({ name: fakeValidCategory.name, id: body.expenseCategory.id }),
      )
    })
  })
  test.describe('when a request is sent to create an expenseCategory with the same name as an existing expenseCategory for the same accountId', () => {
    const newFakeCategoryName = `Category-${Math.random()}`
    test('should throw an error with DB_ERROR', async ({ request }) => {
      // First, create the category
      await request.post(`${BASE_URL}/createexpensecategory`, {
        data: { ...fakeValidCategory, name: newFakeCategoryName },
      })

      // Attempt to create the same category again
      const response2 = await request.post(`${BASE_URL}/createexpensecategory`, {
        data: { ...fakeValidCategory, name: newFakeCategoryName },
      })
      const body = await response2.json()

      expect(response2.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      expect(body.error).toContain(DB_ERROR)
    })
  })
})
