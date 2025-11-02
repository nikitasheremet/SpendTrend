import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getCategories } from '../getCategories'
import { getExpenseCategories } from '@/gateway/expenseCategory/getExpenseCategories'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expenseCategory/getExpenseCategories')
vi.mock('@/store/store')

describe('getCategories', () => {
  const mockGetExpenseCategories = vi.mocked(getExpenseCategories)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseCategories: ExpenseCategory[] = [
    {
      id: 'category-123',
      userId: 'user-123',
      accountId: 'account-123',
      name: 'Test Category',
      subCategories: [],
      createdAt: new Date('2025-09-22T10:00:00Z'),
      updatedAt: new Date('2025-09-22T10:00:00Z'),
    },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when getCategories is successfull', () => {
    it('should return the expense categories', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      mockGetExpenseCategories.mockResolvedValue(fakeExpenseCategories)

      const result = await getCategories()

      expect(result).toEqual(fakeExpenseCategories)
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

      await expect(getCategories()).rejects.toThrow(fakeError)
    })
  })

  describe('when getExpenseCategories fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      const fakeError = new Error('Failed to get expense categories')
      mockGetExpenseCategories.mockRejectedValue(fakeError)

      await expect(getCategories()).rejects.toThrow(fakeError)
    })
  })
})
