import { updateExpenseSubcategoryService } from '../../service/updateExpenseSubCategoryService'
import {
  updateExpenseSubcategoryRepository,
  getExpenseSubCategoryByIdRepository,
} from '../../repository/updateExpenseSubCategoryRepository'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../repository/updateExpenseSubcategoryRepository')

const mockUpdateExpenseSubcategoryRepository =
  updateExpenseSubcategoryRepository as jest.MockedFunction<
    typeof updateExpenseSubcategoryRepository
  >
const mockGetExpenseSubCategoryByIdRepository =
  getExpenseSubCategoryByIdRepository as jest.MockedFunction<
    typeof getExpenseSubCategoryByIdRepository
  >

describe('when updating expense subcategory service', () => {
  const fakeInput = {
    subCategoryId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Subcategory Name',
  }

  const fakeExistingSubcategory = {
    id: fakeInput.subCategoryId,
    userId: fakeInput.userId,
    accountId: fakeInput.accountId,
    name: 'Old Name',
    categoryId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeUpdatedSubcategory = {
    ...fakeExistingSubcategory,
    name: fakeInput.name,
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when subcategory does not exist', () => {
    it('should throw RepositoryError', async () => {
      mockGetExpenseSubCategoryByIdRepository.mockResolvedValue(null)

      await expect(updateExpenseSubcategoryService(fakeInput)).rejects.toThrow(
        new RepositoryError('Expense subcategory not found'),
      )

      expect(mockGetExpenseSubCategoryByIdRepository).toHaveBeenCalledWith(fakeInput.subCategoryId)
      expect(mockUpdateExpenseSubcategoryRepository).not.toHaveBeenCalled()
    })
  })

  describe('when subcategory belongs to different user', () => {
    it('should throw RepositoryError for unauthorized access', async () => {
      const fakeSubcategoryWithDifferentUser = {
        ...fakeExistingSubcategory,
        userId: 'different-user-id',
      }
      mockGetExpenseSubCategoryByIdRepository.mockResolvedValue(fakeSubcategoryWithDifferentUser)

      await expect(updateExpenseSubcategoryService(fakeInput)).rejects.toThrow(
        new RepositoryError(
          'Unauthorized: Cannot update subcategory owned by another user or account',
        ),
      )

      expect(mockGetExpenseSubCategoryByIdRepository).toHaveBeenCalledWith(fakeInput.subCategoryId)
      expect(mockUpdateExpenseSubcategoryRepository).not.toHaveBeenCalled()
    })
  })

  describe('when subcategory belongs to different account', () => {
    it('should throw RepositoryError for unauthorized access', async () => {
      const fakeSubcategoryWithDifferentAccount = {
        ...fakeExistingSubcategory,
        accountId: 'different-account-id',
      }
      mockGetExpenseSubCategoryByIdRepository.mockResolvedValue(fakeSubcategoryWithDifferentAccount)

      await expect(updateExpenseSubcategoryService(fakeInput)).rejects.toThrow(
        new RepositoryError(
          'Unauthorized: Cannot update subcategory owned by another user or account',
        ),
      )

      expect(mockGetExpenseSubCategoryByIdRepository).toHaveBeenCalledWith(fakeInput.subCategoryId)
      expect(mockUpdateExpenseSubcategoryRepository).not.toHaveBeenCalled()
    })
  })

  describe('when repository update fails', () => {
    it('should bubble up the repository error', async () => {
      const fakeRepositoryError = new RepositoryError('Database update failed')
      mockGetExpenseSubCategoryByIdRepository.mockResolvedValue(fakeExistingSubcategory)
      mockUpdateExpenseSubcategoryRepository.mockRejectedValue(fakeRepositoryError)

      await expect(updateExpenseSubcategoryService(fakeInput)).rejects.toThrow(fakeRepositoryError)

      expect(mockGetExpenseSubCategoryByIdRepository).toHaveBeenCalledWith(fakeInput.subCategoryId)
      expect(mockUpdateExpenseSubcategoryRepository).toHaveBeenCalledWith(fakeInput.subCategoryId, {
        name: fakeInput.name,
        userId: fakeInput.userId,
        accountId: fakeInput.accountId,
      })
    })
  })

  describe('when repository update succeeds', () => {
    it('should return updated subcategory', async () => {
      mockGetExpenseSubCategoryByIdRepository.mockResolvedValue(fakeExistingSubcategory)
      mockUpdateExpenseSubcategoryRepository.mockResolvedValue(fakeUpdatedSubcategory)

      const result = await updateExpenseSubcategoryService(fakeInput)

      expect(result).toEqual(fakeUpdatedSubcategory)
      expect(mockGetExpenseSubCategoryByIdRepository).toHaveBeenCalledWith(fakeInput.subCategoryId)
      expect(mockUpdateExpenseSubcategoryRepository).toHaveBeenCalledWith(fakeInput.subCategoryId, {
        name: fakeInput.name,
        userId: fakeInput.userId,
        accountId: fakeInput.accountId,
      })
    })
  })
})
