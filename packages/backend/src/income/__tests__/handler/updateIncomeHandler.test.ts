import type { Context } from 'hono'
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
      mockValidateUpdateIncomeInput.mockImplementation(() => {
        throw mockValidationError
      })

      const response = await updateIncomeHandler(fakeContext)

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

      mockUpdateIncomeService.mockRejectedValue(mockServiceError)

      const response = await updateIncomeHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
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

      mockUpdateIncomeService.mockResolvedValue(mockUpdatedIncome)

      const response = await updateIncomeHandler(fakeContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({
        updatedIncome: mockUpdatedIncome,
      })
    })
  })
})
