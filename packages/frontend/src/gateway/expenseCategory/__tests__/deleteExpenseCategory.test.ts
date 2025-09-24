import {
  deleteExpenseCategory,
  DeleteExpenseCategoryRequest,
} from '@gateway/expenseCategory/deleteExpenseCategory'
import { post } from '@gateway/post'
import { DeleteExpenseCategoryResponse } from '@contracts/expenseCategory/deleteExpenseCategory'

vi.mock('@gateway/post')
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('deleteExpenseCategory', () => {
  const mockPost = vi.mocked(post)

  const fakeDeleteExpenseCategoryRequest: DeleteExpenseCategoryRequest = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    id: '123e4567-e89b-12d3-a456-426614174002',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the deleted expense category', async () => {
      const fakeResponse = {
        expenseCategory: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          subCategories: [],
        },
      } as unknown as DeleteExpenseCategoryResponse
      mockPost.mockResolvedValue(fakeResponse)

      const result = await deleteExpenseCategory(fakeDeleteExpenseCategoryRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174002',
        }),
      )
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPost.mockRejectedValue(fakeError)

      await expect(deleteExpenseCategory(fakeDeleteExpenseCategoryRequest)).rejects.toThrow(
        fakeError,
      )
    })
  })
})
