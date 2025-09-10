import { createExpenseSubcategoryHandler } from '../../handler/createExpenseSubcategoryHandler'
import * as service from '../../service/createExpenseSubcategoryService'
import * as validation from '../../validation/createExpenseSubcategoryValidation'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { ValidationError } from '../../../models/errors/validationError'

jest.mock('../../service/createExpenseSubcategoryService')
jest.mock('../../validation/createExpenseSubcategoryValidation')

describe('createExpenseSubcategoryHandler', () => {
  const mockService = service.createExpenseSubcategoryService as jest.Mock
  const mockValidation = validation.validateCreateExpenseSubcategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidRequest = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
  }

  const fakeValidContext: any = {
    request: {
      body: fakeValidRequest,
    },
    status: 0,
    body: undefined,
  }

  const fakeExpenseSubCategory = {
    id: '00000000-0000-4000-8000-000000000003',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('when validation passes and service succeeds', () => {
    it('should return 201 status and expense subcategory', async () => {
      mockService.mockResolvedValue(fakeExpenseSubCategory)

      await createExpenseSubcategoryHandler(fakeValidContext)

      expect(mockValidation).toHaveBeenCalledWith(fakeValidRequest)
      expect(mockService).toHaveBeenCalledWith(fakeValidRequest)
      expect(fakeValidContext.status).toBe(STATUS_CREATED_201)
      expect(fakeValidContext.body).toEqual({ expenseSubCategory: fakeExpenseSubCategory })
    })
  })

  describe('when validation fails', () => {
    it('should return error status code and message', async () => {
      const fakeValidationError = new ValidationError('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })

      await createExpenseSubcategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBeUndefined()
      expect(fakeValidContext.body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('when service fails', () => {
    it('should return error status code and message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })

      await createExpenseSubcategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBeUndefined()
      expect(fakeValidContext.body).toEqual({ error: fakeServiceError.message })
    })
  })
})
