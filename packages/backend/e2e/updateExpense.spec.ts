import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'

const BASE_URL = 'http://localhost:3000'

test.describe('Update Expense Endpoint', () => {
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
})
