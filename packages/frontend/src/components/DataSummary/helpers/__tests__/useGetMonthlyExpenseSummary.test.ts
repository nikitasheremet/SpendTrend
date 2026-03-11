import { describe, expect, it } from 'vitest'
import type { Expense, ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { buildSortedPositiveExpensesForMonth } from '../useGetMonthlyExpenseSummary'

const fakeCreatedAt = new Date('2026-01-01T00:00:00.000Z')

const fakeSubCategory: ExpenseSubCategory = {
  id: 'fake-subcategory-id',
  userId: 'fake-user-id',
  accountId: 'fake-account-id',
  name: 'Takeout',
  categoryId: 'fake-category-id',
  createdAt: fakeCreatedAt,
  updatedAt: fakeCreatedAt,
}

const fakeCategory: ExpenseCategory = {
  id: 'fake-category-id',
  userId: 'fake-user-id',
  accountId: 'fake-account-id',
  name: 'Food',
  subCategories: [fakeSubCategory],
  createdAt: fakeCreatedAt,
  updatedAt: fakeCreatedAt,
}

function createFakeExpense(params: {
  id: string
  name: string
  date: string
  netAmount: number
  subCategory?: ExpenseSubCategory
}): Expense {
  return {
    id: params.id,
    userId: 'fake-user-id',
    accountId: 'fake-account-id',
    date: params.date,
    name: params.name,
    netAmount: params.netAmount,
    amount: params.netAmount,
    category: fakeCategory,
    subCategory: params.subCategory,
    createdAt: fakeCreatedAt,
    updatedAt: fakeCreatedAt,
  }
}

describe('when building sorted expense rows for a month occurs', () => {
  it('should return only positive expenses for the selected month sorted by netAmount and newest date tie-breaker', () => {
    const fakeExpenses = [
      createFakeExpense({
        id: 'fake-expense-1',
        name: 'Higher but older',
        date: '2026-03-01',
        netAmount: 100,
      }),
      createFakeExpense({
        id: 'fake-expense-2',
        name: 'Highest',
        date: '2026-03-03',
        netAmount: 300,
      }),
      createFakeExpense({
        id: 'fake-expense-3',
        name: 'Higher and newer',
        date: '2026-03-05',
        netAmount: 100,
      }),
      createFakeExpense({
        id: 'fake-expense-4',
        name: 'Zero amount should be excluded',
        date: '2026-03-05',
        netAmount: 0,
      }),
      createFakeExpense({
        id: 'fake-expense-5',
        name: 'Negative should be excluded',
        date: '2026-03-06',
        netAmount: -10,
      }),
      createFakeExpense({
        id: 'fake-expense-6',
        name: 'Different month should be excluded',
        date: '2026-02-20',
        netAmount: 500,
      }),
    ]

    const result = buildSortedPositiveExpensesForMonth(fakeExpenses, 2, 2026)

    expect(result.map((expense) => expense.id)).toEqual([
      'fake-expense-2',
      'fake-expense-3',
      'fake-expense-1',
    ])
  })
})
