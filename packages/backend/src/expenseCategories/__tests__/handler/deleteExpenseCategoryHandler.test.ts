import { deleteExpenseCategoryHandler } from '../../handler/deleteExpenseCategoryHandler'
import * as service from '../../service/deleteExpenseCategoryService'
import * as validation from '../../validation/deleteExpenseCategoryValidation'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'

jest.mock('../../service/deleteExpenseCategoryService')
jest.mock('../../validation/deleteExpenseCategoryValidation')

describe('deleteExpenseCategoryHandler', () => {
  const mockService = service.deleteExpenseCategoryService as jest.Mock
  const mockValidation = validation.validateDeleteExpenseCategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidRequest = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    id: '00000000-0000-4000-8000-000000000002',
  }

  const fakeValidContext: any = {
    request: {
      body: fakeValidRequest,
    },
    status: 0,
    body: undefined,
  }

  describe('when request is successful', () => {
    it('should return 200 and deleted expenseCategory', async () => {
      const fakeResult = {
        id: '00000000-0000-4000-8000-000000000002',
      }
      mockService.mockResolvedValueOnce(fakeResult)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeValidContext.body).toEqual({ expenseCategory: fakeResult })
    })
  })

  describe('when validation throws error', () => {
    it('should return error status code and message', async () => {
      const fakeValidationError = new Error('Validation failed')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeValidContext.body).toEqual({ error: 'Validation failed' })
    })
  })

  describe('when service throws error', () => {
    it('should return error status code and message', async () => {
      const fakeServiceError = new Error('Database error')
      mockService.mockRejectedValueOnce(fakeServiceError)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeValidContext.body).toEqual({ error: 'Database error' })
    })
  })

  describe('when service throws unknown error', () => {
    it('should return error status code and message', async () => {
      const fakeUnknownError = new Error('Unknown error')
      mockService.mockRejectedValueOnce(fakeUnknownError)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeValidContext.body).toEqual({ error: 'Unknown error' })
    })
  })
})