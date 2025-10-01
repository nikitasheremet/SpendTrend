import { Context } from 'koa'
import { updateIncomeHandler } from '../../handler/updateIncomeHandler'
import { validateUpdateIncomeInput } from '../../validation/updateIncomeValidation'
import { ValidationError } from '../../../models/errors/validationError'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { updateIncomeService } from '../../service/updateIncomeService'

jest.mock('../../validation/updateIncomeValidation')
jest.mock('../../service/updateIncomeService')

const mockUpdateIncomeService = updateIncomeService as jest.Mock
const mockValidateUpdateIncomeInput = validateUpdateIncomeInput as jest.Mock

describe('updateIncomeHandler', () => {
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
      mockValidateUpdateIncomeInput.mockImplementation(() => {
        throw mockValidationError
      })

      await updateIncomeHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        error: mockValidationError.message,
      })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status code and message', async () => {
      const mockServiceError = new Error('Service error')

      // Mock the service to throw an error
      mockUpdateIncomeService.mockRejectedValue(mockServiceError)

      await updateIncomeHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        error: mockServiceError.message,
      })
    })
  })

  describe('when request is successful', () => {
    it('should return 200 status and updated income object', async () => {
      const mockUpdatedIncome = {
        id: '123',
        name: 'Updated Income',
        amount: 6000,
      }

      // Mock the service to return the updated income
      mockUpdateIncomeService.mockResolvedValue(mockUpdatedIncome)

      fakeContext.request.body = { id: '123', name: 'Updated Income', amount: 6000 }

      await updateIncomeHandler(fakeContext)

      expect(fakeContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({
        updatedIncome: mockUpdatedIncome,
      })
    })
  })
})
