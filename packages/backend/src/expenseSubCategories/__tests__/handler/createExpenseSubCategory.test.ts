import { createExpenseSubCategoryHandler } from '../../handler/createExpenseSubCategoryHandler'
import * as service from '../../service/createExpenseSubCategoryService'
import * as validation from '../../validation/createExpenseSubCategoryValidation'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { ValidationError } from '../../../models/errors/validationError'

jest.mock('../../service/createExpenseSubCategoryService')
jest.mock('../../validation/createExpenseSubCategoryValidation')

describe('createExpenseSubcategoryHandler', () => {
  const mockService = service.createExpenseSubCategoryService as jest.Mock
  const mockValidation = validation.validateCreateExpenseSubCategoryInput as jest.Mock

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
    name: 'Test SubCategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('when validation passes and service succeeds', () => {
    it('should return 201 status and expense subCategory', async () => {
      mockService.mockResolvedValue(fakeExpenseSubCategory)

      await createExpenseSubCategoryHandler(fakeValidContext)

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

      await createExpenseSubCategoryHandler(fakeValidContext)

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

      await createExpenseSubCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).not.toBeUndefined()
      expect(fakeValidContext.body).toEqual({ error: fakeServiceError.message })
    })
  })
})
