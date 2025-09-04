import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { updateExpenseCategoryHandler } from '../../handler/updateExpenseCategoryHandler'
import { updateExpenseCategoryService } from '../../service/updateExpenseCategoryService'
import { validateUpdateExpenseCategoryInput } from '../../validation/updateExpenseCategoryValidation'

jest.mock('../../service/updateExpenseCategoryService')
jest.mock('../../validation/updateExpenseCategoryValidation')

describe('updateExpenseCategoryHandler', () => {
  const mockService = updateExpenseCategoryService as jest.Mock
  const mockValidation = validateUpdateExpenseCategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeContext: any = {
    request: {
      body: {},
    },
    status: 0,
    body: undefined,
  }

  describe('when request is successful', () => {
    it('should return 200 status code and updatedExpense', async () => {
      const fakeResult = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Category',
      }
      mockService.mockResolvedValueOnce(fakeResult)

      await updateExpenseCategoryHandler(fakeContext)

      expect(fakeContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({ expenseCategory: fakeResult })
    })
  })

  describe('when validation throws error', () => {
    it('should return error status code and error message', async () => {
      const FAKE_VALIDATION_FAILURE = 'validation failed'
      mockValidation.mockImplementationOnce(() => {
        throw new Error(FAKE_VALIDATION_FAILURE)
      })

      await updateExpenseCategoryHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body.error).toBe(FAKE_VALIDATION_FAILURE)
    })
  })

  describe('when service throws error', () => {
    it('should return error status code and error message', async () => {
      const FAKE_SERVICE_FAILURE = 'service failed'
      mockService.mockImplementationOnce(() => {
        throw new Error(FAKE_SERVICE_FAILURE)
      })

      await updateExpenseCategoryHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body.error).toBe(FAKE_SERVICE_FAILURE)
    })
  })
})
