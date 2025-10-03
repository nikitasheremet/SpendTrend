import type { Context } from 'hono'
import { ValidationError } from '../../../models/errors/validationError'
import { validateDeleteExpenseInput } from '../../validation/'
import { deleteExpenseHandler } from '../../handler/deleteExpenseHandler'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { deleteExpenseService } from '../../service/deleteExpenseService'

jest.mock('../../validation')
jest.mock('../../service/deleteExpenseService')

const mockValidation = validateDeleteExpenseInput as jest.Mock
const mockService = deleteExpenseService as jest.Mock

describe('deleteExpenseHandler', () => {
  const fakeCtx = {
    req: {
      formData: jest.fn(),
    },
  } as unknown as Context

  beforeEach(() => {
    mockService.mockReset()
    jest.resetAllMocks()
  })

  describe('when input is invalid', () => {
    it('should throw a error status code and message', async () => {
      const mockValidationError = new ValidationError('Invalid input')
      mockValidation.mockImplementation(() => {
        throw mockValidationError
      })

      const response = await deleteExpenseHandler(fakeCtx)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        error: mockValidationError.message,
      })
    })
  })

  describe('when service logic fails', () => {
    it('should throw a error status code and message', async () => {
      const fakeServiceError = new ValidationError('Invalid input')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })

      const response = await deleteExpenseHandler(fakeCtx)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        error: fakeServiceError.message,
      })
    })
  })

  describe('on successful request', () => {
    it('should return status 200 and deleted expense', async () => {
      const fakeDeletedExpense = { id: 123 }
      mockService.mockResolvedValue(fakeDeletedExpense)

      const response = await deleteExpenseHandler(fakeCtx)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        expense: fakeDeletedExpense,
      })
    })
  })
})
