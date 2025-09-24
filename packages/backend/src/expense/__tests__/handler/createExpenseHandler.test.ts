import { createExpenseService } from '../../service/createExpenseService'
import { validateCreateExpenseInput } from '../../validation/'
import type { Context } from 'koa'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { createExpenseHandler } from '../../handler/createExpenseHandler'

jest.mock('../../service/createExpenseService')
jest.mock('../../validation')

const mockService = createExpenseService as jest.Mock
const mockValidation = validateCreateExpenseInput as jest.Mock

describe('createExpenseHandler', () => {
  const fakeCtx = {
    request: {
      body: {},
    },
    status: undefined,
    body: undefined,
  } as unknown as Context

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  describe('on success', () => {
    it('should return 201 and expense', async () => {
      // Arrange
      mockService.mockResolvedValue({ id: 1, name: 'Lunch' })

      // Act
      await createExpenseHandler(fakeCtx)

      // Assert
      expect(fakeCtx.status).toBe(STATUS_CREATED_201)
      expect(fakeCtx.body).toEqual({ createdExpense: { id: 1, name: 'Lunch' } })
    })
  })

  describe('on validation error', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      await createExpenseHandler(fakeCtx)
      expect(fakeCtx.status).not.toBeUndefined()
      expect(fakeCtx.body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('on service error', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      await createExpenseHandler(fakeCtx)
      expect(fakeCtx.status).not.toBeUndefined()
      expect(fakeCtx.body).toEqual({ error: fakeServiceError.message })
    })
  })
})
