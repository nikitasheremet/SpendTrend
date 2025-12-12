import { vi, describe, it, expect, beforeEach } from 'vitest'
import { updateSubCategory } from '../updateSubCategory'
import { updateExpenseSubCategory } from '@/gateway/expenseSubCategory/updateExpenseSubCategory'
import { getStore } from '@/store/store'
import type { ExpenseSubCategory } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expenseSubCategory/updateExpenseSubCategory')
vi.mock('@/store/store')

describe('updateSubCategory', () => {
  const mockUpdateExpenseSubCategory = vi.mocked(updateExpenseSubCategory)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseSubCategory = {
    id: 'subcategory-123',
    name: 'Updated SubCategory Name',
    userId: 'user-123',
    accountId: 'account-123',
    categoryId: 'category-123',
    createdAt: new Date('2025-09-22T10:00:00Z'),
    updatedAt: new Date('2025-12-07T10:00:00Z'),
  } as ExpenseSubCategory

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when updateSubCategory is successful', () => {
    it('should return the updated expense subcategory', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      mockUpdateExpenseSubCategory.mockResolvedValue(fakeExpenseSubCategory)

      const result = await updateSubCategory('subcategory-123', 'Updated SubCategory Name')

      expect(result).toEqual(fakeExpenseSubCategory)
      expect(mockUpdateExpenseSubCategory).toHaveBeenCalledWith({
        subCategoryId: 'subcategory-123',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Updated SubCategory Name',
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

      await expect(
        updateSubCategory('subcategory-123', 'Updated SubCategory Name'),
      ).rejects.toThrow(fakeError)
    })
  })

  describe('when updateExpenseSubCategory fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      const fakeError = new Error('Failed to update expense subcategory')
      mockUpdateExpenseSubCategory.mockRejectedValue(fakeError)

      await expect(
        updateSubCategory('subcategory-123', 'Updated SubCategory Name'),
      ).rejects.toThrow(fakeError)
    })
  })
})
