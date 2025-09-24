import {
  createExpenseSubCategory,
  CreateExpenseSubCategoryRequest,
} from '@gateway/expenseSubCategory/createExpenseSubCategory'
import { post } from '@gateway/post'
import { CreateExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/createExpenseSubCategory'

vi.mock('@gateway/post')

describe('createExpenseSubCategory', () => {
  const mockPost = vi.mocked(post)

  const fakeCreateExpenseSubCategoryRequest: CreateExpenseSubCategoryRequest = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    categoryId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Test SubCategory',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the created expense subcategory', async () => {
      const fakeResponse = {
        expenseSubCategory: {
          id: '123e4567-e89b-12d3-a456-426614174003',
        },
      } as CreateExpenseSubCategoryResponse
      mockPost.mockResolvedValue(fakeResponse)

      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174003',
      }
      const result = await createExpenseSubCategory(fakeCreateExpenseSubCategoryRequest)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPost.mockRejectedValue(fakeError)

      await expect(createExpenseSubCategory(fakeCreateExpenseSubCategoryRequest)).rejects.toThrow(
        fakeError,
      )
    })
  })
})
