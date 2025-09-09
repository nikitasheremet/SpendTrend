import { createExpenseCategoryHandler } from '../../handler/createExpenseCategoryHandler'
import * as service from '../../service/createExpenseCategoryService'
import * as validation from '../../validation/createExpenseCategoryValidation'

jest.mock('../../service/createExpenseCategoryService')
jest.mock('../../validation/createExpenseCategoryValidation')

describe('createExpenseCategoryHandler', () => {
  const mockService = service.createExpenseCategoryService as jest.Mock
  const mockValidation = validation.validateCreateExpenseCategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidRequest = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    name: 'x',
    subcategories: [],
  }

  const fakeValidContext: any = {
    request: {
      body: fakeValidRequest,
    },
    status: 0,
    body: undefined,
  }

  describe('when request is successful', () => {
    it('should return 201 and created expenseCategory', async () => {
      const fakeResult = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Groceries',
        subcategories: ['A'],
      }
      mockService.mockResolvedValueOnce(fakeResult)

      await createExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).toBe(201)
      expect(fakeValidContext.body).toEqual({ expenseCategory: fakeResult })
    })
  })

  describe('when validation throws error', () => {
    it('should return error status code and message', async () => {
      const FAKE_VALIDATION_FAILURE = 'invalid'
      mockValidation.mockImplementationOnce(() => {
        throw new Error(FAKE_VALIDATION_FAILURE)
      })

      const fakeInvalidCtx: any = { request: { body: {} }, status: 0, body: undefined }

      await createExpenseCategoryHandler(fakeInvalidCtx)

      expect(fakeInvalidCtx.status).not.toBe(201)
      expect(fakeInvalidCtx.body.error).toBe(FAKE_VALIDATION_FAILURE)
    })
  })

  describe('when service throws error', () => {
    it('should return error status code and message', async () => {
      const FAKE_SERVICE_FAILURE = 'service failed'
      mockService.mockImplementationOnce(() => {
        throw new Error(FAKE_SERVICE_FAILURE)
      })

      await createExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBe(201)
      expect(fakeValidContext.body.error).toBe(FAKE_SERVICE_FAILURE)
    })
  })
})
