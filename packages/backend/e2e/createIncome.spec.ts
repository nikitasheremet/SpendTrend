import { test, expect } from '@playwright/test'
import {
  STATUS_CREATED_201,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import crypto from 'crypto'
import { DB_ERROR } from '../src/models/errors/repositoryErrors'
import { connectToDb, db } from '../src/db'
import { CreateIncomeInput } from '../src/income/validation/models'
import { excludeFieldsAndAdd } from '../src/utilities/excludeFieldsAndAdd'
import { id } from 'zod/v4/locales/index.cjs'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Income Endpoint', () => {
  let fakeCreateIncomeInput: CreateIncomeInput

  test.beforeAll(async () => {
    const { createIncomeInput } = await assignFakeCreateIncomeInput()
    fakeCreateIncomeInput = createIncomeInput
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/createincome`, {
        data: fakeBadValidationData,
      })
      const body = await response.json()
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      expect(body).toHaveProperty('error')
    })
  })
  
  test.describe('when valid income data is provided', () => {
    test('should create a new income and return the income object', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/createincome`, {
        data: fakeCreateIncomeInput,
      })

      expect(response.status()).toBe(STATUS_CREATED_201)
      const body = await response.json()

      expect(body).toHaveProperty('createdIncome')
      expect(body.createdIncome).toHaveProperty('id')
      expect(body.createdIncome).toEqual(
        expect.objectContaining({
          id: body.createdIncome.id,
          ...fakeCreateIncomeInput,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )
      const createdIncome = await db.query.incomeTable.findFirst({
        where: (income, { eq }) => eq(income.id, body.createdIncome.id),
      })
      expect(createdIncome).toBeDefined()
      expect(createdIncome).toEqual(
        expect.objectContaining({
          id: body.createdIncome.id,
          userId: fakeCreateIncomeInput.userId,
          accountId: fakeCreateIncomeInput.accountId,
          name: fakeCreateIncomeInput.name,
          amount: fakeCreateIncomeInput.amount,
          date: fakeCreateIncomeInput.date,
        }),
      )
    })
  })
})

async function assignFakeCreateIncomeInput(): Promise<{ createIncomeInput: CreateIncomeInput}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  const createIncomeInput = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Salary',
    amount: 100,
    date: '2025-08-07',
  }

  return { createIncomeInput }
}
