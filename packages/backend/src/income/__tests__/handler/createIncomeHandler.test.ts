import { createIncomeService } from '../../service/createIncomeService'
import { validateCreateIncomeInput } from '../../validation/'
import type { Context } from 'hono'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { createIncomeHandler } from '../../handler/createIncomeHandler'

jest.mock('../../service/createIncomeService')
jest.mock('../../validation')

const mockService = createIncomeService as jest.Mock
const mockValidation = validateCreateIncomeInput as jest.Mock

describe('createIncomeHandler', () => {
  const fakeCtx = {
    req: {
      json: jest.fn(),
    },
  } as unknown as Context

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('on success', () => {
    it('should return 201 and expense', async () => {
      const fakeInput = { id: 1, name: 'Lunch' }
      // Arrange
      mockService.mockResolvedValue(fakeInput)

      // Act
      const response = await createIncomeHandler(fakeCtx)

      // Assert
      expect(response.status).toBe(STATUS_CREATED_201)
      const body = await response.json()
      expect(body).toEqual({ createdIncome: fakeInput })
    })
  })

  describe('on validation error', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      const response = await createIncomeHandler(fakeCtx)
      expect(response.status).not.toBe(STATUS_CREATED_201)
      const body = await response.json()
      expect(body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('on service error', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      const response = await createIncomeHandler(fakeCtx)
      expect(response.status).not.toBe(STATUS_CREATED_201)
      const body = await response.json()
      expect(body).toEqual({ error: fakeServiceError.message })
    })
  })
})
