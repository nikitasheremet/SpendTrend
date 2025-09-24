import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getExpenses } from '../getExpenses'
import { getExpensesGateway } from '@/gateway/expense/getExpenses'
import { getStore } from '@/store/store'
import type { Expense } from '@/types/expenseData'

vi.mock('@/gateway/expense/getExpenses')
vi.mock('@/store/store')

describe('getExpenses', () => {
  const mockGetExpensesGateway = vi.mocked(getExpensesGateway)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenses = [
    {
      id: 'expense-123',
    },
  ] as Expense[]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when getAccountDetails succeeds and getExpensesGateway succeeds', () => {
    it('should return the expenses', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      })
      mockGetExpensesGateway.mockResolvedValue(fakeExpenses)

      const result = await getExpenses()

      expect(result).toEqual(fakeExpenses)
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

      await expect(getExpenses()).rejects.toThrow(fakeError)
    })
  })

  describe('when getExpensesGateway fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      })
      const fakeError = new Error('Failed to get expenses')
      mockGetExpensesGateway.mockRejectedValue(fakeError)

      await expect(getExpenses()).rejects.toThrow(fakeError)
    })
  })
})
