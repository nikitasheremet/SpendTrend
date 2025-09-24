import { vi, describe, it, expect, beforeEach } from 'vitest'
import { deleteCategory } from '../deleteCategory'
import { deleteExpenseCategory } from '@/gateway/expenseCategory/deleteExpenseCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'

vi.mock('@/gateway/expenseCategory/deleteExpenseCategory')
vi.mock('@/store/store')

describe('deleteCategory', () => {
  const mockDeleteExpenseCategory = vi.mocked(deleteExpenseCategory)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseCategory = {
    id: 'category-123',
  } as ExpenseCategory

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when deleteCategory is successful', () => {
    it('should return the deleted expense category', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      })
      mockDeleteExpenseCategory.mockResolvedValue(fakeExpenseCategory)

      const result = await deleteCategory('category-123')

      expect(result).toEqual(fakeExpenseCategory)
    })
  })

  describe('when getAccountDetails fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Failed to get account details')
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockImplementation(() => {
          throw fakeError
        }),
      })

      await expect(deleteCategory('category-123')).rejects.toThrow(fakeError)
    })
  })

  describe('when deleteExpenseCategory fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      })
      const fakeError = new Error('Failed to delete expense category')
      mockDeleteExpenseCategory.mockRejectedValue(fakeError)

      await expect(deleteCategory('category-123')).rejects.toThrow(fakeError)
    })
  })
})
