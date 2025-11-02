import { vi, describe, it, expect, beforeEach } from 'vitest'
import { deleteSubCategory } from '../deleteSubCategory'
import { deleteExpenseSubCategory } from '@/gateway/expenseSubCategory/deleteExpenseSubCategory'
import { getStore } from '@/store/store'
import type { ExpenseSubCategory } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expenseSubCategory/deleteExpenseSubCategory')
vi.mock('@/store/store')

describe('deleteSubcategory', () => {
  const mockDeleteExpenseSubCategory = vi.mocked(deleteExpenseSubCategory)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseSubCategory = {
    id: 'subcategory-123',
  } as ExpenseSubCategory

  const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }

  beforeEach(() => {
    vi.resetAllMocks()
    mockGetStore.mockReturnValue({
      getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
    } as unknown as Store)
  })

  describe('when deleteSubcategory is successful', () => {
    it('should return the deleted expense subcategory', async () => {
      mockDeleteExpenseSubCategory.mockResolvedValue(fakeExpenseSubCategory)

      const result = await deleteSubCategory('subcategory-123')

      expect(result).toEqual(fakeExpenseSubCategory)
    })
  })

  describe('when getAccountDetails fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Failed to get account details')
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockImplementation(() => {
          throw fakeError
        }),
      } as unknown as Store)

      await expect(deleteSubCategory('subcategory-123')).rejects.toThrow(fakeError)
    })
  })

  describe('when deleteExpenseSubCategory fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Failed to delete expense subcategory')
      mockDeleteExpenseSubCategory.mockRejectedValue(fakeError)

      await expect(deleteSubCategory('subcategory-123')).rejects.toThrow(fakeError)
    })
  })
})
