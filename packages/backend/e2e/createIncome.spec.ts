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
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe('when internal server error occurs', () => {
    test('should return error message and 500 status code', async ({ request }) => {
      const fakeBadValidationData = JSON.parse(JSON.stringify(fakeCreateIncomeInput))
      fakeBadValidationData.userId = 'invalid-uuid'

      const response = await request.post(`${BASE_URL}/createincome`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
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
      expect(body).toHaveProperty('id')
      expect(body).toEqual(
        expect.objectContaining({
          ...fakeCreateIncomeInput,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      )
    })
  })
})

async function assignFakeCreateIncomeInput(): Promise<{
  createIncomeInput: CreateIncomeInput
}> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()
  const fakeIncomeId = crypto.randomUUID()

  const createIncomeInput = {
    id: fakeIncomeId,
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Salary',
    amount: 100,
    date: '2025-08-07',
  }

  return {
    createIncomeInput,
  }
}
