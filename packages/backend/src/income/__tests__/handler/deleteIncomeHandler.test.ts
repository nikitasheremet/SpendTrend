import { Context } from 'koa'
import { ValidationError } from '../../../models/errors/validationError'
import { validateDeleteIncomeInput } from '../../validation/'
import { deleteIncomeHandler } from '../../handler/deleteIncomeHandler'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { deleteIncomeService } from '../../service/deleteIncomeService'

jest.mock('../../validation')
jest.mock('../../service/deleteIncomeService')

const mockValidation = validateDeleteIncomeInput as jest.Mock
const mockService = deleteIncomeService as jest.Mock

describe('deleteIncomeHandler', () => {
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

  describe('when input is invalid', () => {
    it('should throw a error status code and message', async () => {
      const mockValidationError = new ValidationError('Invalid input')
      mockValidation.mockImplementation(() => {
        throw mockValidationError
      })

      await deleteIncomeHandler(fakeCtx)

      expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({
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

      await deleteIncomeHandler(fakeCtx)

      expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({
        error: fakeServiceError.message,
      })
    })
  })

  describe('on successful request', () => {
    it('should return status 200 and deleted income', async () => {
      const fakeDeletedIncome = { id: 123 }
      mockService.mockResolvedValue(fakeDeletedIncome)

      await deleteIncomeHandler(fakeCtx)

      expect(fakeCtx.status).toBe(STATUS_SUCCESS_200)
      expect(fakeCtx.body).toEqual({
        deletedIncome: fakeDeletedIncome,
      })
    })
  })
})
