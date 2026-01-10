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
    json: jest.fn(
      (body: unknown, status: number) => new Response(JSON.stringify(body), { status }),
    ),
  } as unknown as Context

  beforeEach(() => {
    jest.resetAllMocks()
    ;(fakeCtx.req.json as jest.Mock).mockResolvedValue({})
  })

  describe('on success', () => {
    it('should return 201 and flat arrays', async () => {
      const fakeServiceOutput = {
        createdIncomes: [{ id: '1', name: 'Salary' }],
        failedIncomes: [],
      }
      // Arrange
      mockService.mockResolvedValue(fakeServiceOutput)

      // Act
      await createIncomeHandler(fakeCtx)

      // Assert
      expect(fakeCtx.json as jest.Mock).toHaveBeenCalledWith(fakeServiceOutput, STATUS_CREATED_201)
    })
  })

  describe('on validation error', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      await createIncomeHandler(fakeCtx)
      const call = (fakeCtx.json as jest.Mock).mock.calls[0]
      expect(call[0]).toEqual({ error: fakeValidationError.message })
      expect(call[1]).not.toBe(STATUS_CREATED_201)
    })
  })

  describe('on service error', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      await createIncomeHandler(fakeCtx)
      const call = (fakeCtx.json as jest.Mock).mock.calls[0]
      expect(call[0]).toEqual({ error: fakeServiceError.message })
      expect(call[1]).not.toBe(STATUS_CREATED_201)
    })
  })
})
