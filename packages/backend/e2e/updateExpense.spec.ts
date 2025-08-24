import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expensesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Expense Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })

  const fakeAccountId = crypto.randomUUID()
  const fakeExpenseData = {
    userId: '00000000-0000-0000-0000-000000000001',
    accountId: fakeAccountId,
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-07',
    category: 'Food',
    subCategory: 'Supermarket',
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      // Arrange
      const fakeBadValidationData = {}

      // Act
      const response = await request.put(`${BASE_URL}/updateexpense`, {
        data: fakeBadValidationData,
      })

      // Assert
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when an expense is updated successfully', () => {
    test('should return the merged expense and updatedAt should change', async ({ request }) => {
      // Insert a test expense directly into the database
      const [createdExpense] = await db.insert(expensesTable).values(fakeExpenseData).returning()

      // Prepare update - change name and amount
      const updatePayload = {
        id: createdExpense.id,
        name: 'Updated Groceries',
        amount: 150,
      }

      // Call the update endpoint
      const response = await request.put(`${BASE_URL}/updateexpense`, {
        data: updatePayload,
      })

      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body).toHaveProperty('updatedExpense')

      const updated = body.updatedExpense

      // ID and linkage fields remain the same
      expect(updated.id).toBe(createdExpense.id)
      expect(updated.userId).toBe(fakeExpenseData.userId)
      expect(updated.accountId).toBe(fakeAccountId)

      // Updated fields reflect the payload
      expect(updated.name).toBe(updatePayload.name)
      expect(updated.amount).toBe(updatePayload.amount)

      // Fields not updated remain the same
      expect(updated.date).toBe(fakeExpenseData.date)
      expect(updated.category).toBe(fakeExpenseData.category)

      // createdAt should be unchanged (compare to the original input's ISO string)
      expect(updated.createdAt).toBe(fakeExpenseData.createdAt.toISOString())

      // updatedAt should be different and newer than the original
      const originalUpdatedAt = new Date(createdExpense.updatedAt)
      const newUpdatedAt = new Date(updated.updatedAt)
      expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })

  test.describe('when updating a non-existent expense', () => {
    test('should return 404 when the expense id does not exist', async ({ request }) => {
      // Arrange - use a random id that was not inserted
      const updatePayload = {
        id: crypto.randomUUID(),
        name: 'Does not exist',
        amount: 999,
      }

      // Act
      const response = await request.put(`${BASE_URL}/updateexpense`, {
        data: updatePayload,
      })

      // Assert
      expect(response.status()).toBe(404)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
})
