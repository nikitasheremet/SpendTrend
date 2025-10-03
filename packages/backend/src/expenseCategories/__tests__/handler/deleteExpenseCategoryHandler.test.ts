import type { Context } from 'hono'
import { deleteExpenseCategoryHandler } from '../../handler/deleteExpenseCategoryHandler'
import { deleteExpenseCategoryService } from '../../service/deleteExpenseCategoryService'
import { validateDeleteExpenseCategoryInput } from '../../validation/deleteExpenseCategoryValidation'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'

jest.mock('../../service/deleteExpenseCategoryService')
jest.mock('../../validation/deleteExpenseCategoryValidation')

describe('deleteExpenseCategoryHandler', () => {
  const mockService = deleteExpenseCategoryService as jest.Mock
  const mockValidation = validateDeleteExpenseCategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidRequest = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    id: '00000000-0000-4000-8000-000000000002',
  }

  const fakeValidContext = {
    req: {
      json: jest.fn(),
    },
  } as unknown as Context

  describe('when request is successful', () => {
    it('should return 200 and deleted expenseCategory', async () => {
      const fakeResult = {
        id: '00000000-0000-4000-8000-000000000002',
      }
      mockService.mockResolvedValueOnce(fakeResult)

      const response = await deleteExpenseCategoryHandler(fakeValidContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ expenseCategory: fakeResult })
    })
  })

  describe('when validation throws error', () => {
    it('should return error status code and message', async () => {
      const fakeValidationError = new Error('Validation failed')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })

      const response = await deleteExpenseCategoryHandler(fakeValidContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: 'Validation failed' })
    })
  })

  describe('when service throws error', () => {
    it('should return error status code and message', async () => {
      const fakeServiceError = new Error('Database error')
      mockService.mockRejectedValueOnce(fakeServiceError)

      const response = await deleteExpenseCategoryHandler(fakeValidContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: 'Database error' })
    })
  })
})
