import type { Context } from 'hono'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { getExpenseCategoriesHandler } from '../../handler/getExpenseCategoriesHandler'
import { getExpenseCategoriesService } from '../../service/getExpenseCategoriesService'
import * as validation from '../../validation/getExpenseCategoriesValidation'

jest.mock('../../service/getExpenseCategoriesService')
jest.mock('../../validation/getExpenseCategoriesValidation')

describe('getExpenseCategoriesHandler', () => {
  const mockService = getExpenseCategoriesService as jest.Mock
  const mockValidation = validation.validateGetExpenseCategoriesInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidQuery = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
  }

  const fakeValidContext = {
    req: {
      query: jest.fn().mockReturnValue(fakeValidQuery),
    },
  } as unknown as Context

  describe('when request is successful', () => {
    it('should return 200 and expenseCategories', async () => {
      const fakeResult = [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Groceries', subcategories: ['A'] },
      ]
      mockService.mockResolvedValueOnce(fakeResult)

      const response = await getExpenseCategoriesHandler(fakeValidContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ expenseCategories: fakeResult })
    })
  })

  describe('when validation throws error', () => {
    it('should return error status code and message', async () => {
      const FAKE_VALIDATION_FAILURE = 'invalid'
      mockValidation.mockImplementationOnce(() => {
        throw new Error(FAKE_VALIDATION_FAILURE)
      })

      const fakeInvalidCtx = {
        req: {
          query: jest.fn().mockReturnValue({}),
        },
      } as unknown as Context

      const response = await getExpenseCategoriesHandler(fakeInvalidCtx)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body.error).toBe(FAKE_VALIDATION_FAILURE)
    })
  })

  describe('when service throws error', () => {
    it('should return error status code and message', async () => {
      const FAKE_SERVICE_FAILURE = 'service failed'
      mockService.mockImplementationOnce(() => {
        throw new Error(FAKE_SERVICE_FAILURE)
      })

      const response = await getExpenseCategoriesHandler(fakeValidContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body.error).toBe(FAKE_SERVICE_FAILURE)
    })
  })
})
