import { getIncomesService } from '../../service/getIncomesService'
import { validateGetIncomesInput } from '../../validation/'
import type { Context } from 'hono'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { getIncomesHandler } from '../../handler/getIncomesHandler'

vi.mock('../../service/getIncomesService')
vi.mock('../../validation')

const mockService = getIncomesService as Mock
const mockValidation = validateGetIncomesInput as Mock

describe('getIncomesHandler', () => {
  const fakeCtx = {
    req: {
      query: vi.fn(),
    },
  } as unknown as Context

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when successful', () => {
    it('should return 200 and income list', async () => {
      const fakeIncomeList = [
        {
          id: 'income-1',
        },
      ]
      // Arrange
      mockService.mockResolvedValue(fakeIncomeList)

      // Act
      const response = await getIncomesHandler(fakeCtx)

      // Assert
      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ incomes: fakeIncomeList })
    })
  })

  describe('when validation error occurs', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      const response = await getIncomesHandler(fakeCtx)
      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('when service error occurs', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      const response = await getIncomesHandler(fakeCtx)
      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: fakeServiceError.message })
    })
  })
})
