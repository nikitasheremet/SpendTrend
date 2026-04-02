import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Expense, ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import type { Income } from '@/types/income/income'
import type { Store } from '@/store/storeInterface'
import {
  buildSortedPositiveExpensesForMonth,
  UNCATEGORIZED_CATEGORY_ID,
  useGetMonthlyExpenseSummary,
} from '../useGetMonthlyExpenseSummary'

const { fakeStoreExpenses, fakeStoreCategories, fakeStoreIncomes } = vi.hoisted(() => ({
  fakeStoreExpenses: { value: [] as Expense[] },
  fakeStoreCategories: { value: [] as ExpenseCategory[] },
  fakeStoreIncomes: { value: [] as Income[] },
}))

vi.mock('@/store/store', () => {
  const fakeStore = {
    expenses: fakeStoreExpenses,
    categories: fakeStoreCategories,
    incomes: fakeStoreIncomes,
  } as Store

  return {
    getStore: () => fakeStore,
  }
})

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

const fakeSecondCategory: ExpenseCategory = {
  id: 'fake-second-category-id',
  userId: 'fake-user-id',
  accountId: 'fake-account-id',
  name: 'Utilities',
  subCategories: [],
  createdAt: fakeCreatedAt,
  updatedAt: fakeCreatedAt,
}

function createFakeExpense(params: {
  id: string
  name: string
  date: string
  netAmount: number
  category?: ExpenseCategory
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
    category: params.category,
    subCategory: params.subCategory,
    createdAt: fakeCreatedAt,
    updatedAt: fakeCreatedAt,
  }
}

function createFakeIncome(params: { id: string; amount: number; date: string }): Income {
  return {
    id: params.id,
    userId: 'fake-user-id',
    accountId: 'fake-account-id',
    name: 'Salary',
    amount: params.amount,
    date: params.date,
    createdAt: fakeCreatedAt,
    updatedAt: fakeCreatedAt,
  }
}

beforeEach(() => {
  fakeStoreCategories.value = [fakeCategory, fakeSecondCategory]
  fakeStoreExpenses.value = []
  fakeStoreIncomes.value = []
})

describe('when building sorted expense rows for a month occurs', () => {
  it('should return only positive expenses for the selected month sorted by netAmount and newest date tie-breaker', () => {
    const fakeExpenses = [
      createFakeExpense({
        id: 'fake-expense-1',
        name: 'Higher but older',
        date: '2026-03-01',
        netAmount: 100,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-expense-2',
        name: 'Highest',
        date: '2026-03-03',
        netAmount: 300,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-expense-3',
        name: 'Higher and newer',
        date: '2026-03-05',
        netAmount: 100,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-expense-4',
        name: 'Zero amount should be excluded',
        date: '2026-03-05',
        netAmount: 0,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-expense-5',
        name: 'Negative should be excluded',
        date: '2026-03-06',
        netAmount: -10,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-expense-6',
        name: 'Different month should be excluded',
        date: '2026-02-20',
        netAmount: 500,
        category: fakeCategory,
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

describe('when monthly summary includes expenses without category occurs', () => {
  it('should include a synthetic uncategorized category with full metrics, sorted details, and always as last category', () => {
    fakeStoreExpenses.value = [
      createFakeExpense({
        id: 'fake-categorized-expense',
        name: 'Groceries',
        date: '2026-03-04',
        netAmount: 50,
        category: fakeCategory,
      }),
      createFakeExpense({
        id: 'fake-uncategorized-expense-1',
        name: 'Insurance',
        date: '2026-03-20',
        netAmount: 300,
      }),
      createFakeExpense({
        id: 'fake-uncategorized-expense-2',
        name: 'License fee',
        date: '2026-03-10',
        netAmount: 100,
      }),
      createFakeExpense({
        id: 'fake-uncategorized-expense-3',
        name: 'Past January cost',
        date: '2026-01-12',
        netAmount: 90,
      }),
      createFakeExpense({
        id: 'fake-uncategorized-expense-4',
        name: 'Past February cost',
        date: '2026-02-11',
        netAmount: 210,
      }),
    ]
    fakeStoreIncomes.value = [
      createFakeIncome({ id: 'fake-income-1', amount: 1000, date: '2026-03-01' }),
    ]

    const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(ref(2), ref(2026))

    const uncategorizedSummary = summaryForSelectedMonthByCategory.value.find(
      (category) => category.id === UNCATEGORIZED_CATEGORY_ID,
    )

    expect(uncategorizedSummary).toBeDefined()
    expect(uncategorizedSummary?.name).toBe('Uncategorized')
    expect(uncategorizedSummary?.total).toBe(400)
    expect(uncategorizedSummary?.threeMonthAvg).toBe(150)
    expect(uncategorizedSummary?.diffTotalToAvg).toBe(250)
    expect(uncategorizedSummary?.diffTotalToAvgAsPercent).toBe(167)
    expect(uncategorizedSummary?.uncategorizedExpenses.map((expense) => expense.id)).toEqual([
      'fake-uncategorized-expense-1',
      'fake-uncategorized-expense-2',
    ])

    const lastCategory = summaryForSelectedMonthByCategory.value.at(-1)
    expect(lastCategory?.id).toBe(UNCATEGORIZED_CATEGORY_ID)
  })

  it('should set percent diff as undefined when uncategorized three month average is zero', () => {
    fakeStoreExpenses.value = [
      createFakeExpense({
        id: 'fake-uncategorized-current-month-expense',
        name: 'One-time fee',
        date: '2026-03-10',
        netAmount: 40,
      }),
    ]

    const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(ref(2), ref(2026))

    const uncategorizedSummary = summaryForSelectedMonthByCategory.value.find(
      (category) => category.id === UNCATEGORIZED_CATEGORY_ID,
    )

    expect(uncategorizedSummary?.threeMonthAvg).toBe(0)
    expect(uncategorizedSummary?.diffTotalToAvgAsPercent).toBeUndefined()
  })
})
