import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422, STATUS_NOT_FOUND_404 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { incomeTable } from '../src/db/schema'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { CreateIncome } from '../src/income/repository/createIncomeRepository'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Income Endpoint', () => {
  let dataToCreateIncome: CreateIncome

  test.beforeAll(async () => {
    const { incomeToCreate } = await assignFakeCreateIncomeInput()
    dataToCreateIncome = incomeToCreate
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      // Arrange
      const fakeBadValidationData = {}

      // Act
      const response = await request.put(`${BASE_URL}/updateincome`, {
        data: fakeBadValidationData,
      })

      // Assert
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when an income is updated successfully', () => {
    test('should return the merged income and updatedAt should change', async ({ request }) => {
      // Insert a test income directly into the database
      const [createdIncome] = await db.insert(incomeTable).values(dataToCreateIncome).returning()

      // Prepare update - change name and amount
      const updatePayload = {
        id: createdIncome.id,
        userId: createdIncome.userId,
        accountId: createdIncome.accountId,
        name: 'Updated Salary',
        amount: 5000,
      }

      // Call the update endpoint
      const response = await request.put(`${BASE_URL}/updateincome`, {
        data: updatePayload,
      })

      expect(response.status()).toBe(200)
      const body = await response.json()

      const updated = body.updatedIncome

      // ID and linkage fields remain the same
      expect(updated).toMatchObject({
        id: createdIncome.id,
        userId: createdIncome.userId,
        accountId: createdIncome.accountId,
        name: updatePayload.name,
        amount: updatePayload.amount,
        date: createdIncome.date,
        createdAt: createdIncome.createdAt.toISOString(),
      })

      // updatedAt should be different and newer than the original
      const originalUpdatedAt = new Date(createdIncome.updatedAt)
      const newUpdatedAt = new Date(updated.updatedAt)
      expect(newUpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())

      // Manually confirm in the db that the income was updated correctly
      const [dbUpdatedIncome] = await db
        .select()
        .from(incomeTable)
        .where(eq(incomeTable.id, createdIncome.id))

      expect(dbUpdatedIncome.name).toBe(updatePayload.name)
      expect(dbUpdatedIncome.amount).toBe(updatePayload.amount)
      expect(dbUpdatedIncome.date).toBe(createdIncome.date)
      expect(new Date(dbUpdatedIncome.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      )
    })
  })

  test.describe('when updating a non-existent income', () => {
    test('should return 404 when the income id does not exist', async ({ request }) => {
      // Arrange - use a random id that was not inserted
      const updatePayload = {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        accountId: crypto.randomUUID(),
        name: 'Does not exist',
        amount: 999,
      }

      // Act
      const response = await request.put(`${BASE_URL}/updateincome`, {
        data: updatePayload,
      })

      // Assert
      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body).toHaveProperty('error')
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })
})

async function assignFakeCreateIncomeInput(): Promise<{
  incomeToCreate: CreateIncome
}> {
  connectToDb()

  const fakeIncomeData = {
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
    name: 'Salary',
    amount: 3000,
    date: '2025-08-07',
  }

  return {
    incomeToCreate: fakeIncomeData,
  }
}
