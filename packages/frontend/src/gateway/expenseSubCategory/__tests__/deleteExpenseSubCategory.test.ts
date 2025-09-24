import {
  deleteExpenseSubCategory,
  DeleteExpenseSubCategoryRequest,
} from '@gateway/expenseSubCategory/deleteExpenseSubCategory'
import { post } from '@gateway/post'
import { DeleteExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/deleteExpenseSubCategory'

vi.mock('@gateway/post')

describe('deleteExpenseSubCategory', () => {
  const mockPost = vi.mocked(post)

  const fakeDeleteExpenseSubCategoryRequest: DeleteExpenseSubCategoryRequest = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subCategoryId: '123e4567-e89b-12d3-a456-426614174002',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the deleted expense subcategory', async () => {
      const fakeResponse = {
        expenseSubCategory: {
          id: '123e4567-e89b-12d3-a456-426614174002',
        },
      } as DeleteExpenseSubCategoryResponse
      mockPost.mockResolvedValue(fakeResponse)

      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174002',
      }
      const result = await deleteExpenseSubCategory(fakeDeleteExpenseSubCategoryRequest)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPost.mockRejectedValue(fakeError)

      await expect(deleteExpenseSubCategory(fakeDeleteExpenseSubCategoryRequest)).rejects.toThrow(
        fakeError,
      )
    })
  })
})
