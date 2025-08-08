import { test, expect } from '@playwright/test'
import { VALIDATION_ERROR_NAME } from '../src/models/errors/validationError'
import {
  STATUS_CREATED_201,
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Expense Endpoint', () => {
  const fakeValidExpenseData = {
    userId: '00000000-0000-0000-0000-000000000001',
    accountId: '00000000-0000-0000-0000-000000000002',
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-07',
    category: 'Food',
    subCategory: 'Supermarket',
    paidBackAmount: 0,
  }
  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
      expect(body.error).toContain(VALIDATION_ERROR_NAME)
    })
  })
  test.describe('when internal server error occurs', () => {
    test('should return error message and 500 status code', async ({ request }) => {
      const fakeBadValidationData = JSON.parse(JSON.stringify(fakeValidExpenseData))
      fakeBadValidationData.userId = 'invalid-uuid'

      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeBadValidationData,
      })
      expect(response.status()).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })
  test.describe('when valid expense data is provided', () => {
    test('should create a new expense and return the expense object', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/createexpense`, {
        data: fakeValidExpenseData,
      })

      expect(response.status()).toBe(STATUS_CREATED_201)
      const body = await response.json()
      expect(body).toHaveProperty('id')
      expect(body).toEqual(
        expect.objectContaining({
          name: fakeValidExpenseData.name,
          userId: fakeValidExpenseData.userId,
          accountId: fakeValidExpenseData.accountId,
          paidBackAmount: fakeValidExpenseData.paidBackAmount,
          amount: fakeValidExpenseData.amount,
          netAmount: fakeValidExpenseData.netAmount,
          date: fakeValidExpenseData.date,
          category: fakeValidExpenseData.category,
          subCategory: fakeValidExpenseData.subCategory,
        }),
      )
    })
  })
})
