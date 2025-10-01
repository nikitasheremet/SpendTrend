import { test, expect } from '@playwright/test'
import {
  STATUS_SUCCESS_200,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_NOT_FOUND_404,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { connectToDb, db } from '../src/db'
import { incomeTable } from '../src/db/schema'
import { DeleteIncomeInput } from '../src/income/validation/models'
import { IncomeDbRow } from '../src/models/income/income'
import { NOT_FOUND_ERROR } from '../src/models/errors/repositoryErrors'
import { eq } from 'drizzle-orm'

const BASE_URL = 'http://localhost:3000'

test.describe('Delete Income Endpoint', () => {
  let createdIncome: IncomeDbRow
  let fakeDeleteIncomeInput: DeleteIncomeInput

  test.beforeAll(async () => {
    const testData = await setupTestData()
    createdIncome = testData.income
    fakeDeleteIncomeInput = testData.deleteInput
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code for missing fields', async ({
      request,
    }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/deleteincome`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when income does not exist', () => {
    test('should return a 404 error with not found message', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/deleteincome`, {
        data: {
          ...fakeDeleteIncomeInput,
          id: crypto.randomUUID(),
        },
      })
      expect(response.status()).toBe(STATUS_NOT_FOUND_404)
      const body = await response.json()
      expect(body.error).toContain(NOT_FOUND_ERROR)
    })
  })

  test.describe('when valid income delete data is provided', () => {
    test('should delete the income and return the deleted income object', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/deleteincome`, {
        data: fakeDeleteIncomeInput,
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)

      const body = await response.json()
      expect(body.deletedIncome).toEqual(
        expect.objectContaining({
          id: createdIncome.id,
          userId: fakeDeleteIncomeInput.userId,
          accountId: fakeDeleteIncomeInput.accountId,
          name: createdIncome.name,
          amount: createdIncome.amount,
          date: createdIncome.date,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )

      // Verify the income was actually deleted
      const remainingIncomes = await db
        .select()
        .from(incomeTable)
        .where(eq(incomeTable.id, createdIncome.id))

      expect(remainingIncomes.length).toBe(0)
    })
  })
})

async function setupTestData(): Promise<{
  income: IncomeDbRow
  deleteInput: DeleteIncomeInput
}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  // Create a test income
  const [createdIncome] = await db
    .insert(incomeTable)
    .values({
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: `Test Income for Delete-${Math.random()}`,
      amount: 5000, // $50.00
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    })
    .returning()

  const deleteInput: DeleteIncomeInput = {
    id: createdIncome.id,
    userId: fakeUserId,
    accountId: fakeAccountId,
  }

  return {
    income: createdIncome,
    deleteInput,
  }
}
