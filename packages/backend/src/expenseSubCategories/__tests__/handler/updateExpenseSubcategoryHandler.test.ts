import { updateExpenseSubcategoryHandler } from '../../handler/updateExpenseSubCategoryHandler'
import { validateUpdateExpenseSubCategory } from '../../validation/updateExpenseSubCategoryValidation'
import { updateExpenseSubCategoryService } from '../../service/updateExpenseSubCategoryService'
import { errorStatusMapper } from '../../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { ValidationError } from '../../../models/errors/validationError'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../validation/updateExpenseSubCategoryValidation')
jest.mock('../../service/updateExpenseSubCategoryService')
jest.mock('../../../utilities/errorStatusMapper')

const mockValidateUpdateExpenseSubCategory =
  validateUpdateExpenseSubCategory as jest.MockedFunction<typeof validateUpdateExpenseSubCategory>
const mockUpdateExpenseSubCategoryService = updateExpenseSubCategoryService as jest.MockedFunction<
  typeof updateExpenseSubCategoryService
>
const mockErrorStatusMapper = errorStatusMapper as jest.MockedFunction<typeof errorStatusMapper>

describe('when handling update expense subcategory request', () => {
  const fakeSubCategoryId = '123e4567-e89b-12d3-a456-426614174000'
  const fakeRequestBody = {
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Subcategory Name',
  }

  const fakeUpdatedSubcategory = {
    id: fakeSubCategoryId,
    userId: fakeRequestBody.userId,
    accountId: fakeRequestBody.accountId,
    name: fakeRequestBody.name,
    categoryId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  let fakeContext: any

  beforeEach(() => {
    fakeContext = {
      params: { subCategoryId: fakeSubCategoryId },
      request: { body: fakeRequestBody },
      status: 0,
      body: {},
    }

    jest.clearAllMocks()
  })

  describe('when validation throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeValidationError = new ValidationError('Invalid input')
      mockValidateUpdateExpenseSubCategory.mockImplementation(() => {
        throw fakeValidationError
      })
      mockErrorStatusMapper.mockReturnValue(400)

      await updateExpenseSubcategoryHandler(fakeContext)

      expect(fakeContext.status).toBe(400)
      expect(fakeContext.body).toEqual({ error: 'Invalid input' })
      expect(mockUpdateExpenseSubCategoryService).not.toHaveBeenCalled()
    })
  })

  describe('when service throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeServiceError = new RepositoryError('Database error')
      mockValidateUpdateExpenseSubCategory.mockImplementation(() => {})
      mockUpdateExpenseSubCategoryService.mockRejectedValue(fakeServiceError)
      mockErrorStatusMapper.mockReturnValue(500)

      await updateExpenseSubcategoryHandler(fakeContext)

      expect(fakeContext.status).toBe(500)
      expect(fakeContext.body).toEqual({ error: 'Database error' })
    })
  })

  describe('when everything succeeds', () => {
    it('should return 200 status and updated subcategory', async () => {
      mockValidateUpdateExpenseSubCategory.mockImplementation(() => {})
      mockUpdateExpenseSubCategoryService.mockResolvedValue(fakeUpdatedSubcategory)

      await updateExpenseSubcategoryHandler(fakeContext)

      expect(mockValidateUpdateExpenseSubCategory).toHaveBeenCalledWith({
        subCategoryId: fakeSubCategoryId,
        ...fakeRequestBody,
      })
      expect(mockUpdateExpenseSubCategoryService).toHaveBeenCalledWith({
        subCategoryId: fakeSubCategoryId,
        ...fakeRequestBody,
      })
      expect(fakeContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({ expenseSubCategory: fakeUpdatedSubcategory })
    })
  })
})
