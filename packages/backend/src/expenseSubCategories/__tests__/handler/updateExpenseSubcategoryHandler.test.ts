import { updateExpenseSubCategoryHandler } from '../../handler/updateExpenseSubCategoryHandler'
import { validateUpdateExpenseSubCategory } from '../../validation/updateExpenseSubCategoryValidation'
import { updateExpenseSubCategoryService } from '../../service/updateExpenseSubCategoryService'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { ValidationError } from '../../../models/errors/validationError'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../validation/updateExpenseSubCategoryValidation')
jest.mock('../../service/updateExpenseSubCategoryService')

const mockValidateUpdateExpenseSubCategory = validateUpdateExpenseSubCategory as jest.Mock
const mockUpdateExpenseSubCategoryService = updateExpenseSubCategoryService as jest.Mock

describe('updateSubCategoryHandler', () => {
  const fakeRequestBody = {
    subCategoryId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Subcategory Name',
  }

  let fakeContext: any

  beforeEach(() => {
    fakeContext = {
      request: { body: fakeRequestBody },
      status: 0,
      body: {},
    }

    jest.resetAllMocks()
  })

  describe('when validation throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeValidationError = new ValidationError('Invalid input')
      mockValidateUpdateExpenseSubCategory.mockImplementation(() => {
        throw fakeValidationError
      })

      await updateExpenseSubCategoryHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({ error: 'Invalid input' })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeServiceError = new RepositoryError('Database error')
      mockUpdateExpenseSubCategoryService.mockRejectedValue(fakeServiceError)

      await updateExpenseSubCategoryHandler(fakeContext)

      expect(fakeContext.status).not.toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({ error: 'Database error' })
    })
  })

  describe('when everything succeeds', () => {
    it('should return 200 status and updated subcategory', async () => {
      const fakeUpdatedSubcategory = {
        name: 'updatedSubcategory',
      }
      mockUpdateExpenseSubCategoryService.mockResolvedValue(fakeUpdatedSubcategory)

      await updateExpenseSubCategoryHandler(fakeContext)

      expect(fakeContext.status).toBe(STATUS_SUCCESS_200)
      expect(fakeContext.body).toEqual({ updatedExpenseSubCategory: fakeUpdatedSubcategory })
    })
  })
})
