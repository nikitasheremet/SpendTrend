import { test, expect } from '@playwright/test'
import { STATUS_SUCCESS_200, STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe.skip('Get Expense Categories Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })
  test.describe('when invalid input is provided', () => {
    test('should return 422 status code and an error message', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/getexpensecategories`)
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when request is successful', () => {
    test('should return an array of expenseCategories', async ({ request }) => {
      const fakeAccountId = crypto.randomUUID()
      const fakeUserId = crypto.randomUUID()
      const fakeCategory1 = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        name: `Category1-${Math.random()}`,
        subcategories: ['Sub1', 'Sub2'],
      }
      const fakeCategory2 = {
        userId: fakeUserId,
        accountId: fakeAccountId,
        name: `Category2-${Math.random()}`,
        subcategories: ['Sub3'],
      }

      // Insert categories directly into database and get inserted data
      const [insertedCategory1] = await db
        .insert(expenseCategoriesTable)
        .values(fakeCategory1)
        .returning()
      const [insertedCategory2] = await db
        .insert(expenseCategoriesTable)
        .values(fakeCategory2)
        .returning()

      // Get categories
      const response = await request.get(`${BASE_URL}/getexpensecategories`, {
        params: {
          userId: fakeUserId,
          accountId: fakeAccountId,
        },
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toHaveProperty('expenseCategories')
      expect(body.expenseCategories.length).toBe(2)

      // Assert queried data matches inserted data, including createdAt and updatedAt
      expect(body.expenseCategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: insertedCategory1.id,
            name: insertedCategory1.name,
            userId: insertedCategory1.userId,
            accountId: insertedCategory1.accountId,
            subcategories: insertedCategory1.subcategories,
            createdAt: insertedCategory1.createdAt.toISOString(),
            updatedAt: insertedCategory1.updatedAt.toISOString(),
          }),
          expect.objectContaining({
            id: insertedCategory2.id,
            name: insertedCategory2.name,
            userId: insertedCategory2.userId,
            accountId: insertedCategory2.accountId,
            subcategories: insertedCategory2.subcategories,
            createdAt: insertedCategory2.createdAt.toISOString(),
            updatedAt: insertedCategory2.updatedAt.toISOString(),
          }),
        ]),
      )
    })
  })

  test.describe('when account has no expenseCategories', () => {
    test('should return an empty array', async ({ request }) => {
      const fakeAccountId = crypto.randomUUID()
      const fakeUserId = crypto.randomUUID()

      const response = await request.get(`${BASE_URL}/getexpensecategories`, {
        params: {
          userId: fakeUserId,
          accountId: fakeAccountId,
        },
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body.expenseCategories.length).toBe(0)
    })
  })
})
