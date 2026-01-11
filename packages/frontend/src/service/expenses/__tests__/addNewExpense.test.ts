import { vi, describe, it, expect, beforeEach } from 'vitest'
import { addNewExpense } from '../addNewExpense'
import { createExpense } from '@/gateway/expense/createExpense'
import { getStore } from '@/store/store'
import type { NewExpense, Expense } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expense/createExpense')
vi.mock('@/store/store')

describe('addNewExpense', () => {
  const mockCreateExpense = vi.mocked(createExpense)
  const mockGetStore = vi.mocked(getStore)

  const fakeNewExpense: NewExpense = {
    date: '2023-01-01',
    name: 'Test Expense',
    netAmount: 100,
    amount: 100,
    category: 'category-123',
    subCategory: 'subcategory-123',
  }

  const fakeExpense = {
    id: 'expense-123',
  } as Expense

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when getAccountDetails succeeds and createExpense succeeds', () => {
    it('should return the created expense', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      mockCreateExpense.mockResolvedValue({ createdExpenses: [fakeExpense], failedExpenses: [] })

      const result = await addNewExpense([fakeNewExpense])

      expect(result).toEqual({ createdExpenses: [fakeExpense], failedExpenses: [] })
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

      await expect(addNewExpense([fakeNewExpense])).rejects.toThrow(fakeError)
    })
  })

  describe('when createExpense fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      const fakeError = new Error('Failed to create expense')
      mockCreateExpense.mockRejectedValue(fakeError)

      await expect(addNewExpense([fakeNewExpense])).rejects.toThrow(fakeError)
    })
  })
})
