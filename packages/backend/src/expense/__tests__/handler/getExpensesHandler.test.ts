import type { Context } from 'hono'
import { getExpensesHandler } from '../../handler/getExpensesHandler'
import { validateGetExpensesInput } from '../../validation/getExpensesValidation'
import { getExpensesService } from '../../service/getExpensesService'
import { ValidationError } from '../../../models/errors/validationError'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'

// Mock the validation and service functions
vi.mock('../../validation/getExpensesValidation')
vi.mock('../../service/getExpensesService')

describe('getExpensesHandler', () => {
  const fakeContext = {
    req: {
      query: vi.fn(),
    },
  } as unknown as Context

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when validation fails', () => {
    it('should return error status code and message', async () => {
      const mockValidationError = new ValidationError('Invalid input')
      ;(validateGetExpensesInput as Mock).mockImplementation(() => {
        throw mockValidationError
      })

      const response = await getExpensesHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        error: mockValidationError.message,
      })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status code and message', async () => {
      const mockServiceError = new Error('Database error')

      // Setup service to throw error
      ;(getExpensesService as Mock).mockRejectedValue(mockServiceError)

      const response = await getExpensesHandler(fakeContext)

      // Check error handling
      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
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
      ;(getExpensesService as Mock).mockResolvedValue(mockExpenses)

      const response = await getExpensesHandler(fakeContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        expenses: mockExpenses,
      })
    })
  })
})
