import type { Context } from 'hono'
import { updateExpenseSubCategoryHandler } from '../../handler/updateExpenseSubCategoryHandler'
import { validateUpdateExpenseSubCategory } from '../../validation/updateExpenseSubCategoryValidation'
import { updateExpenseSubCategoryService } from '../../service/updateExpenseSubCategoryService'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { ValidationError } from '../../../models/errors/validationError'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

vi.mock('../../validation/updateExpenseSubCategoryValidation')
vi.mock('../../service/updateExpenseSubCategoryService')

const mockValidateUpdateExpenseSubCategory = validateUpdateExpenseSubCategory as Mock
const mockUpdateExpenseSubCategoryService = updateExpenseSubCategoryService as Mock

describe('updateSubCategoryHandler', () => {
  let fakeContext: Context

  beforeEach(() => {
    fakeContext = {
      req: {
        json: vi.fn(),
      },
    } as unknown as Context

    vi.resetAllMocks()
  })

  describe('when validation throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeValidationError = new ValidationError('Invalid input')
      mockValidateUpdateExpenseSubCategory.mockImplementation(() => {
        throw fakeValidationError
      })

      const response = await updateExpenseSubCategoryHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: 'Invalid input' })
    })
  })

  describe('when service throws an error', () => {
    it('should return error status and error message', async () => {
      const fakeServiceError = new RepositoryError('Database error')
      mockUpdateExpenseSubCategoryService.mockRejectedValue(fakeServiceError)

      const response = await updateExpenseSubCategoryHandler(fakeContext)

      expect(response.status).not.toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ error: 'Database error' })
    })
  })

  describe('when everything succeeds', () => {
    it('should return 200 status and updated subcategory', async () => {
      const fakeUpdatedSubcategory = {
        name: 'updatedSubcategory',
      }
      mockUpdateExpenseSubCategoryService.mockResolvedValue(fakeUpdatedSubcategory)

      const response = await updateExpenseSubCategoryHandler(fakeContext)

      expect(response.status).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toEqual({ updatedExpenseSubCategory: fakeUpdatedSubcategory })
    })
  })
})
