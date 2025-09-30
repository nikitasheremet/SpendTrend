import { getIncomesService } from '../../service/getIncomesService'
import { validateGetIncomesInput } from '../../validation/'
import type { Context } from 'koa'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { getIncomesHandler } from '../../handler/getIncomesHandler'

jest.mock('../../service/getIncomesService')
jest.mock('../../validation')

const mockService = getIncomesService as jest.Mock
const mockValidation = validateGetIncomesInput as jest.Mock

describe('getIncomesHandler', () => {
  const fakeCtx = {
    request: {
      query: {},
    },
    status: undefined,
    body: undefined,
  } as unknown as Context

  beforeEach(() => {
    jest.resetAllMocks()
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
      await getIncomesHandler(fakeCtx)

      // Assert
      expect(fakeCtx.status).toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({ incomes: fakeIncomeList })
    })
  })

  describe('when validation error occurs', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      await getIncomesHandler(fakeCtx)
      expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('when service error occurs', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      await getIncomesHandler(fakeCtx)
      expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({ error: fakeServiceError.message })
    })
  })
})
