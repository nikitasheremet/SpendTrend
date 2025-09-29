import { getIncomeService } from '../../service/getIncomeService'
import { validateGetIncomeInput } from '../../validation/'
import type { Context } from 'koa'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { getIncomeHandler } from '../../handler/getIncomeHandler'

jest.mock('../../service/getIncomeService')
jest.mock('../../validation')

const mockService = getIncomeService as jest.Mock
const mockValidation = validateGetIncomeInput as jest.Mock

describe('getIncomeHandler', () => {
  const fakeCtx = {
    request: {
      body: {},
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
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Salary',
          amount: 5000,
          date: '2023-12-01',
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2023-12-01'),
        },
      ]
      // Arrange
      mockService.mockResolvedValue(fakeIncomeList)

      // Act
      await getIncomeHandler(fakeCtx)

      // Assert
      expect(fakeCtx.status).toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({ income: fakeIncomeList })
    })
  })

  describe('when validation error occurs', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      await getIncomeHandler(fakeCtx)
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
      await getIncomeHandler(fakeCtx)
      expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({ error: fakeServiceError.message })
    })
  })
})