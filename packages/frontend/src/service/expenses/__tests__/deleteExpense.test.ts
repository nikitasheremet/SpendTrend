import { vi, describe, it, expect, beforeEach } from 'vitest'
import { deleteExpense } from '../deleteExpense'
import { deleteExpense as gatewayDeleteExpense } from '@/gateway/expense/deleteExpense'
import { getStore } from '@/store/store'
import type { Expense } from '@/types/expenseData'
import { Store } from '@/store/storeInterface'

vi.mock('@/gateway/expense/deleteExpense')
vi.mock('@/store/store')

describe('deleteExpense', () => {
  const mockGatewayDeleteExpense = vi.mocked(gatewayDeleteExpense)
  const mockGetStore = vi.mocked(getStore)

  const fakeExpenseId = 'expense-123'

  const fakeExpense = {
    id: fakeExpenseId,
    name: 'Deleted Expense',
  } as Expense

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when getAccountDetails succeeds and gateway deleteExpense succeeds', () => {
    it('should return the deleted expense', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      mockGatewayDeleteExpense.mockResolvedValue(fakeExpense)

      const result = await deleteExpense(fakeExpenseId)

      expect(result).toEqual(fakeExpense)
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

      await expect(deleteExpense(fakeExpenseId)).rejects.toThrow(fakeError)
    })
  })

  describe('when gateway deleteExpense fails', () => {
    it('should throw the error', async () => {
      const fakeAccountDetails = { userId: 'user-123', accountId: 'account-123' }
      mockGetStore.mockReturnValue({
        getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
      } as unknown as Store)
      const fakeError = new Error('Failed to delete expense')
      mockGatewayDeleteExpense.mockRejectedValue(fakeError)

      await expect(deleteExpense(fakeExpenseId)).rejects.toThrow(fakeError)
    })
  })
})
