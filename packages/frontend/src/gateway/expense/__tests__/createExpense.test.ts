import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createExpense, CreateExpenseRequest } from '@gateway/expense/createExpense'
import { post } from '@gateway/post'

vi.mock('@gateway/post')

describe('createExpense', () => {
  const mockPost = vi.mocked(post)

  const fakeNewExpense = {
    name: 'Test Expense',
  } as CreateExpenseRequest

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the created expense', async () => {
      const fakeResponse = {
        id: 'expense-123',
        name: 'Test Expense',
      }
      mockPost.mockResolvedValue(fakeResponse)

      const result = await createExpense(fakeNewExpense)

      expect(result).toEqual(expect.objectContaining({ id: 'expense-123', name: 'Test Expense' }))
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Post failed')
      mockPost.mockRejectedValue(fakeError)

      await expect(createExpense(fakeNewExpense)).rejects.toThrow(fakeError)
    })
  })
})
