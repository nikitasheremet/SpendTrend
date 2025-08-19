import { Context } from 'koa'
import { getExpensesHandler } from '../../handler/getExpensesHandler'
import { validateGetExpensesInput } from '../../validation/getExpensesValidation'
import { getExpensesService } from '../../service/getExpensesService'
import { ValidationError } from '../../../models/errors/validationError'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'

// Mock the validation and service functions
jest.mock('../../validation/getExpensesValidation')
jest.mock('../../service/getExpensesService')

describe('getExpensesHandler', () => {
  const fakeContext: Context = {
    request: {
      body: {},
    },
    status: undefined,
    body: undefined,
  } as unknown as Context

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when validation fails', () => {
    it('should return error status code and message', async () => {
      const mockValidationError = new ValidationError('Invalid input')
      ;(validateGetExpensesInput as jest.Mock).mockImplementation(() => {
        throw mockValidationError
      })

      await getExpensesHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        error: mockValidationError.message,
      })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status code and message', async () => {
      const mockServiceError = new Error('Database error')

      // Setup service to throw error
      ;(getExpensesService as jest.Mock).mockRejectedValue(mockServiceError)

      await getExpensesHandler(fakeContext)

      // Check error handling
      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        error: mockServiceError.message,
      })
    })
  })

  describe('when request is successful', () => {
    it('should return 200 status and expenses array', async () => {
      const mockExpenses = [
        {
          id: '123',
          name: 'Groceries',
          amount: 100,
        },
        {
          id: '456',
          name: 'Gas',
          amount: 50,
        },
      ]
      ;(getExpensesService as jest.Mock).mockResolvedValue(mockExpenses)

      await getExpensesHandler(fakeContext)

      expect(fakeContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        expenses: mockExpenses,
      })
    })
  })
})
