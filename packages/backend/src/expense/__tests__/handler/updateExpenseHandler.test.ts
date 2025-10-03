import type { Context } from 'hono'
import { updateExpenseHandler } from '../../handler/updateExpenseHandler'
import { validateUpdateExpenseInput } from '../../validation/updateExpenseValidation'
import { ValidationError } from '../../../models/errors/validationError'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { updateExpenseService } from '../../service/updateExpenseService'

jest.mock('../../validation/updateExpenseValidation')
jest.mock('../../service/updateExpenseService')

const mockUpdateExpenseService = updateExpenseService as jest.Mock
const mockValidateUpdateExpenseInput = validateUpdateExpenseInput as jest.Mock

describe('updateExpenseHandler', () => {
  const fakeContext = {
    req: {
      json: jest.fn(),
    },
  } as unknown as Context

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when validation fails', () => {
    it('should return error status code and message', async () => {
      const mockValidationError = new ValidationError('Invalid input')
      mockValidateUpdateExpenseInput.mockImplementation(() => {
        throw mockValidationError
      })

      const response = await updateExpenseHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        error: mockValidationError.message,
      })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status code and message', async () => {
      const mockServiceError = new Error('Service error')

      // Mock the service to throw an error
      mockUpdateExpenseService.mockRejectedValue(mockServiceError)

      const response = await updateExpenseHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        error: mockServiceError.message,
      })
    })
  })

  describe('when request is successful', () => {
    it('should return 200 status and updated expense object', async () => {
      const mockUpdatedExpense = {
        id: '123',
        name: 'Updated Expense',
        amount: 150,
      }

      // Mock the service to return the updated expense
      mockUpdateExpenseService.mockResolvedValue(mockUpdatedExpense)
      ;(fakeContext.req.json as jest.Mock).mockResolvedValue({
        id: '123',
        name: 'Updated Expense',
        amount: 150,
      })

      const response = await updateExpenseHandler(fakeContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        updatedExpense: mockUpdatedExpense,
      })
    })
  })
})
