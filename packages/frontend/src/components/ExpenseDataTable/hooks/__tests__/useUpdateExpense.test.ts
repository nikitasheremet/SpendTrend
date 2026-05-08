import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { Expense } from '@/types/expenseData'
import { useManageExpense } from '../useUpdateExpense'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'

// inject is used inside useManageExpense to get the popover ref — mocked here to avoid
// Vue's "inject() can only be used inside setup()" warning in a non-component test context
vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>()
  return { ...vue, inject: vi.fn().mockReturnValue(undefined) }
})

vi.mock('@/service/expenses/updateExpense', () => ({
  updateExpense: vi.fn(),
}))

vi.mock('@/service/expenses/deleteExpense', () => ({
  deleteExpense: vi.fn(),
}))

const fakeCreatedAt = new Date('2026-01-01T00:00:00.000Z')

const fakeExpense: Expense = {
  id: 'fake-id',
  userId: 'fake-user-id',
  accountId: 'fake-account-id',
  name: 'Coffee',
  amount: 10,
  paidBackAmount: 0,
  netAmount: 10,
  date: '2026-01-15',
  createdAt: fakeCreatedAt,
  updatedAt: fakeCreatedAt,
}

describe('useManageExpense', () => {
  const mockedServiceUpdateExpense = serviceUpdateExpense as Mock

  beforeEach(() => {
    vi.clearAllMocks()
    mockedServiceUpdateExpense.mockResolvedValue(undefined)
  })

  describe('when updating paidBackAmount', () => {
    it('should recalculate netAmount as amount minus new paidBackAmount', async () => {
      // Arrange
      const { updateExpense, expenseData } = useManageExpense(fakeExpense, vi.fn(), vi.fn())

      // Act
      await updateExpense(3, 'paidBackAmount')

      // Assert
      expect(expenseData.value.netAmount).toBe(7)
      expect(expenseData.value.paidBackAmount).toBe(3)
    })

    it('should send the recalculated netAmount to the service', async () => {
      // Arrange
      const { updateExpense } = useManageExpense(fakeExpense, vi.fn(), vi.fn())

      // Act
      await updateExpense(3, 'paidBackAmount')

      // Assert
      expect(mockedServiceUpdateExpense).toHaveBeenCalledWith(
        expect.objectContaining({ paidBackAmount: 3, netAmount: 7 }),
      )
    })
  })

  describe('when updating amount', () => {
    it('should recalculate netAmount as new amount minus paidBackAmount', async () => {
      // Arrange
      const expenseWithPaidBack = { ...fakeExpense, amount: 10, paidBackAmount: 2, netAmount: 8 }
      const { updateExpense, expenseData } = useManageExpense(expenseWithPaidBack, vi.fn(), vi.fn())

      // Act
      await updateExpense(15, 'amount')

      // Assert
      expect(expenseData.value.netAmount).toBe(13)
      expect(expenseData.value.amount).toBe(15)
    })
  })

  describe('when updating a non-amount field', () => {
    it('should not change netAmount', async () => {
      // Arrange
      const { updateExpense, expenseData } = useManageExpense(fakeExpense, vi.fn(), vi.fn())

      // Act
      await updateExpense('New name', 'name')

      // Assert
      expect(expenseData.value.netAmount).toBe(10)
      expect(expenseData.value.name).toBe('New name')
    })
  })

  describe('when value has not changed', () => {
    it('should not call the service', async () => {
      // Arrange
      const { updateExpense } = useManageExpense(fakeExpense, vi.fn(), vi.fn())

      // Act — paidBackAmount is already 0
      await updateExpense(0, 'paidBackAmount')

      // Assert
      expect(mockedServiceUpdateExpense).not.toHaveBeenCalled()
    })
  })
})
