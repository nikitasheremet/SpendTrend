import {
  createExpenseCategory,
  CreateExpenseCategoryRequest,
} from '@gateway/expenseCategory/createExpenseCategory'
import { post } from '@gateway/post'
import { CreateExpenseCategoryResponse } from '@contracts/expenseCategory/createExpenseCategory'

vi.mock('@gateway/post')

describe('createExpenseCategory', () => {
  const mockPost = vi.mocked(post)

  const fakeCreateExpenseCategoryRequest: CreateExpenseCategoryRequest = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test Category',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the created expense category', async () => {
      const fakeResponse = {
        expenseCategory: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          subCategories: [] as unknown[],
        },
      } as CreateExpenseCategoryResponse
      mockPost.mockResolvedValue(fakeResponse)

      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174002',
      }
      const result = await createExpenseCategory(fakeCreateExpenseCategoryRequest)

      expect(result).toEqual(expect.objectContaining(expectedResult))
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPost.mockRejectedValue(fakeError)

      await expect(createExpenseCategory(fakeCreateExpenseCategoryRequest)).rejects.toThrow(
        fakeError,
      )
    })
  })
})
