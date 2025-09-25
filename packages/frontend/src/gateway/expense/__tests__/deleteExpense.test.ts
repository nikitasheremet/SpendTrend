import { vi, describe, it, expect, beforeEach } from 'vitest'
import { deleteExpense } from '@gateway/expense/deleteExpense'
import { post } from '@gateway/post'

vi.mock('@gateway/post')

describe('deleteExpense', () => {
  const mockPost = vi.mocked(post)

  const fakeExpenseId = 'expense-123'
  const fakeUserId = 'user-456'
  const fakeAccountId = 'account-789'

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the deleted expense', async () => {
      const fakeResponse = {
        deletedExpense: {
          id: fakeExpenseId,
          name: 'Deleted Expense',
          category: {
            id: 'category-123',
            subCategories: [],
          },
        },
      }
      mockPost.mockResolvedValue(fakeResponse)

      const result = await deleteExpense(fakeExpenseId, fakeUserId, fakeAccountId)

      expect(result).toEqual(
        expect.objectContaining({ id: fakeExpenseId, name: 'Deleted Expense' }),
      )
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Post failed')
      mockPost.mockRejectedValue(fakeError)

      await expect(deleteExpense(fakeExpenseId, fakeUserId, fakeAccountId)).rejects.toThrow(
        fakeError,
      )
    })
  })
})
