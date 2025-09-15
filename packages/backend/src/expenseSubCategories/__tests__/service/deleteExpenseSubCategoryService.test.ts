import { deleteExpenseSubCategoryService } from '../../service/deleteExpenseSubCategoryService'
import {
  deleteExpenseSubCategoryRepository,
  deleteExpenseSubCategoryReferencesInExpenses,
} from '../../repository/deleteExpenseSubCategoryRepository'
import { NOT_FOUND_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../repository/deleteExpenseSubCategoryRepository')

describe('deleteExpenseSubCategoryService', () => {
  const mockDeleteRepository = deleteExpenseSubCategoryRepository as jest.Mock
  const mockDeleteReferencesRepository = deleteExpenseSubCategoryReferencesInExpenses as jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const fakeInput = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subCategoryId: '123e4567-e89b-12d3-a456-426614174002',
  }

  const fakeDeletedSubCategory = {
    id: fakeInput.subCategoryId,
    user_id: fakeInput.userId,
    account_id: fakeInput.accountId,
    name: 'Fake SubCategory',
    category_id: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date(),
    updated_at: new Date(),
  }

  it('should return the deleted subcategory from repository', async () => {
    mockDeleteRepository.mockResolvedValue(fakeDeletedSubCategory)
    mockDeleteReferencesRepository.mockResolvedValue(0) // no references removed

    const result = await deleteExpenseSubCategoryService(fakeInput)

    expect(result).toEqual(fakeDeletedSubCategory)
  })

  it('should propagate errors from repository', async () => {
    const mockError = new RepositoryError(`${NOT_FOUND_ERROR}: Subcategory not found`)
    mockDeleteRepository.mockRejectedValue(mockError)

    await expect(deleteExpenseSubCategoryService(fakeInput)).rejects.toThrow(RepositoryError)
  })

  it('should propagate errors from references cleanup', async () => {
    mockDeleteRepository.mockResolvedValue(fakeDeletedSubCategory)
    const mockError = new Error('Failed to clean references')
    mockDeleteReferencesRepository.mockRejectedValue(mockError)

    await expect(deleteExpenseSubCategoryService(fakeInput)).rejects.toThrow(
      'Failed to clean references',
    )
  })
})
