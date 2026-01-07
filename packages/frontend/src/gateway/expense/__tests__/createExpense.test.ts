import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createExpense, CreateExpenseRequest } from '@gateway/expense/createExpense'
import { post } from '@gateway/post'

vi.mock('@gateway/post')

describe('createExpense', () => {
  const mockPost = vi.mocked(post)

  const fakeNewExpense = {
    userId: 'user-1',
    accountId: 'acc-1',
    expensesToCreate: [],
  } as CreateExpenseRequest

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return createdExpenses and mapped failedExpenses', async () => {
      const now = new Date()
      const fakeApiResponse = {
        createdExpense: {
          createdExpenses: [
            {
              id: 'expense-123',
              userId: 'user-1',
              accountId: 'acc-1',
              name: 'Test Expense',
              amount: 100,
              netAmount: 90,
              date: '2026-01-01',
              category: {
                id: 'cat-1',
                userId: 'user-1',
                accountId: 'acc-1',
                name: 'Food',
                subCategories: [],
                createdAt: now,
                updatedAt: now,
              },
              subCategory: undefined,
              paidBackAmount: 0,
              createdAt: now,
              updatedAt: now,
            },
          ],
          failedExpenses: [
            {
              expenseInput: {
                userId: 'user-1',
                accountId: 'acc-1',
                name: 'Fail Expense',
                amount: 50,
                netAmount: 45,
                date: '2026-01-02',
                categoryId: 'cat-1',
                paidBackAmount: 0,
              },
              errorMessage: 'Invalid category',
            },
          ],
        },
      }

      mockPost.mockResolvedValue(fakeApiResponse)

      const result = await createExpense(fakeNewExpense)

      expect(result.createdExpenses).toHaveLength(1)
      expect(result.createdExpenses[0].id).toBe('expense-123')

      expect(result.failedExpenses).toHaveLength(1)
      expect(result.failedExpenses[0]).toEqual(
        expect.objectContaining({
          expenseInput: expect.objectContaining({
            name: 'Fail Expense',
            category: 'cat-1',
          }),
          errorMessage: 'Invalid category',
        }),
      )
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
