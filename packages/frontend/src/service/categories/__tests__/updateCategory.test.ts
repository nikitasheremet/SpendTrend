import { vi, describe, it, expect, beforeEach } from 'vitest'
import { updateCategory } from '../updateCategory'
import { updateExpenseCategory } from '@/gateway/expenseCategory/updateExpenseCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expenseCategory/updateExpenseCategory')
vi.mock('@/store/store')

describe('updateCategory', () => {
  const mockUpdateExpenseCategory = vi.mocked(updateExpenseCategory)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseCategory = {
    id: 'category-123',
    name: 'Updated Category Name',
    userId: 'user-123',
    accountId: 'account-123',
    subCategories: [],
    createdAt: new Date('2025-09-22T10:00:00Z'),
    updatedAt: new Date('2025-12-07T10:00:00Z'),
  } as ExpenseCategory

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when updateCategory is successful', () => {
    it('should return the updated expense category', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      mockUpdateExpenseCategory.mockResolvedValue(fakeExpenseCategory)

      const result = await updateCategory('category-123', 'Updated Category Name')

      expect(result).toEqual(fakeExpenseCategory)
      expect(mockUpdateExpenseCategory).toHaveBeenCalledWith({
        id: 'category-123',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Updated Category Name',
      })
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

      await expect(updateCategory('category-123', 'Updated Category Name')).rejects.toThrow(
        fakeError,
      )
    })
  })

  describe('when updateExpenseCategory fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      const fakeError = new Error('Failed to update expense category')
      mockUpdateExpenseCategory.mockRejectedValue(fakeError)

      await expect(updateCategory('category-123', 'Updated Category Name')).rejects.toThrow(
        fakeError,
      )
    })
  })
})
