import { vi, describe, it, expect, beforeEach } from 'vitest'
import { updateExpense } from '../updateExpense'
import { updateExpense as gatewayUpdateExpense } from '@/gateway/expense/updateExpense'
import type { Expense } from '@/types/expenseData'

vi.mock('@/gateway/expense/updateExpense')

describe('updateExpense', () => {
  const mockGatewayUpdateExpense = vi.mocked(gatewayUpdateExpense)

  const fakeExpense = {
    id: 'expense-123',
    category: {
      id: 'category-123',
    },
    subCategory: {
      id: 'subcategory-123',
    },
  } as Expense

  const fakeUpdatedExpense = { ...fakeExpense, name: 'Updated Expense' }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when gateway updateExpense succeeds', () => {
    it('should map the expense to request format and return the updated expense', async () => {
      mockGatewayUpdateExpense.mockResolvedValue(fakeUpdatedExpense)

      const result = await updateExpense(fakeExpense)

      expect(result).toEqual(fakeUpdatedExpense)
      expect(mockGatewayUpdateExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fakeExpense.id,
          categoryId: fakeExpense.category?.id,
          subCategoryId: fakeExpense.subCategory?.id,
        }),
      )
    })

    it('should send categoryId as null when expense category is missing', async () => {
      mockGatewayUpdateExpense.mockResolvedValue(fakeUpdatedExpense)

      await updateExpense({
        ...fakeExpense,
        category: undefined,
      })

      expect(mockGatewayUpdateExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryId: null,
        }),
      )
    })
  })

  describe('when gateway updateExpense fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Failed to update expense')
      mockGatewayUpdateExpense.mockRejectedValue(fakeError)

      await expect(updateExpense(fakeExpense)).rejects.toThrow(fakeError)
    })
  })
})
