import { describe, expect, it } from 'vitest'
import { getExpenseAverage } from '../getExpenseAverage'
import type { Expense, ExpenseCategory } from '@/types/expenseData'

const fakeDate = new Date('2026-01-01T00:00:00.000Z')

const fakeCategory: ExpenseCategory = {
  id: 'category-id',
  userId: 'user-id',
  accountId: 'account-id',
  name: 'Food',
  subCategories: [],
  createdAt: fakeDate,
  updatedAt: fakeDate,
}

function createFakeExpense(date: string, netAmount: number): Expense {
  return {
    id: `${date}-${netAmount}`,
    userId: 'user-id',
    accountId: 'account-id',
    date,
    name: 'fake-expense',
    netAmount,
    amount: netAmount,
    category: fakeCategory,
    createdAt: fakeDate,
    updatedAt: fakeDate,
  }
}

describe('when calculating expense average for sparse months', () => {
  it('should divide by 1 when only one month has a total greater than 0', () => {
    const fakeExpenses = [createFakeExpense('2026-03-05', 300)]

    const result = getExpenseAverage(fakeExpenses, 3, 2026, 3)

    expect(result).toBe(300)
  })

  it('should divide by 2 when two months have totals greater than 0', () => {
    const fakeExpenses = [createFakeExpense('2026-03-05', 100), createFakeExpense('2026-01-07', 200)]

    const result = getExpenseAverage(fakeExpenses, 3, 2026, 3)

    expect(result).toBe(150)
  })

  it('should divide by 3 when all three months have totals greater than 0', () => {
    const fakeExpenses = [
      createFakeExpense('2026-03-05', 90),
      createFakeExpense('2026-02-07', 60),
      createFakeExpense('2026-01-12', 150),
    ]

    const result = getExpenseAverage(fakeExpenses, 3, 2026, 3)

    expect(result).toBe(100)
  })

  it('should return 0 when no prior month has a total greater than 0', () => {
    const fakeExpenses = [createFakeExpense('2026-03-05', 0)]

    const result = getExpenseAverage(fakeExpenses, 3, 2026, 3)

    expect(result).toBe(0)
  })

  it('should handle year boundary for prior-month lookback', () => {
    const fakeExpenses = [
      createFakeExpense('2025-12-05', 100),
      createFakeExpense('2025-11-07', 200),
      createFakeExpense('2025-10-12', 0),
    ]

    const result = getExpenseAverage(fakeExpenses, 0, 2026, 3)

    expect(result).toBe(150)
  })
})
