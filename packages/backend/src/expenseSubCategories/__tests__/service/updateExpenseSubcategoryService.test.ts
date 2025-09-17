import { updateExpenseSubCategoryService } from '../../service/updateExpenseSubCategoryService'
import { updateExpenseSubCategoryRepository } from '../../repository/updateExpenseSubCategoryRepository'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../repository/updateExpenseSubCategoryRepository')

const mockUpdateExpenseSubcategoryRepository = updateExpenseSubCategoryRepository as jest.Mock

describe('when updating expense subcategory service', () => {
  const fakeInput = {
    subCategoryId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Subcategory Name',
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when repository update fails', () => {
    it('should throw repository error', async () => {
      const fakeRepositoryError = new RepositoryError('Database update failed')
      mockUpdateExpenseSubcategoryRepository.mockRejectedValue(fakeRepositoryError)

      const promiseResult = updateExpenseSubCategoryService(fakeInput)

      await expect(promiseResult).rejects.toThrow(fakeRepositoryError)
    })
  })

  describe('when repository update succeeds', () => {
    it('should return updated subCategory', async () => {
      const fakeUpdatedSubCategory = { id: '123' }
      mockUpdateExpenseSubcategoryRepository.mockResolvedValue(fakeUpdatedSubCategory)

      const result = await updateExpenseSubCategoryService(fakeInput)

      expect(result).toEqual(fakeUpdatedSubCategory)
    })
  })
})
