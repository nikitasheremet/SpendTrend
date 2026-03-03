import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore, getStore } from '../store'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getAllIncomes } from '@/service/income/getAllIncomes'
import type { Expense, ExpenseCategory } from '@/types/expenseData'
import type { Income } from '@/types/income/income'

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    getSession: vi.fn(),
  },
}))

vi.mock('@/service/categories/getCategories', () => ({
  getCategories: vi.fn(),
}))

vi.mock('@/service/expenses/getExpenses', () => ({
  getExpenses: vi.fn(),
}))

vi.mock('@/service/income/getAllIncomes', () => ({
  getAllIncomes: vi.fn(),
}))

const fakeCategory: ExpenseCategory = {
  id: 'category-1',
  userId: 'user-1',
  accountId: 'account-1',
  name: 'Food',
  subCategories: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const fakeExpense: Expense = {
  id: 'expense-1',
  userId: 'user-1',
  accountId: 'account-1',
  date: '2026-01-10',
  name: 'Groceries',
  netAmount: 50,
  amount: 50,
  paidBackAmount: 0,
  category: fakeCategory,
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-01-10'),
}

const fakeIncome: Income = {
  id: 'income-1',
  userId: 'user-1',
  accountId: 'account-1',
  date: '2026-01-15',
  name: 'Salary',
  amount: 1000,
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-15'),
}

describe('when creating and using store state', () => {
  const mockGetSession = vi.mocked(authClient.getSession)
  const mockGetCategories = vi.mocked(getCategories)
  const mockGetExpenses = vi.mocked(getExpenses)
  const mockGetAllIncomes = vi.mocked(getAllIncomes)

  beforeEach(async () => {
    vi.resetAllMocks()

    mockGetSession.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          accountId: 'account-1',
        },
      },
    } as unknown)

    mockGetCategories.mockResolvedValue([fakeCategory])
    mockGetExpenses.mockResolvedValue([fakeExpense])
    mockGetAllIncomes.mockResolvedValue([fakeIncome])

    await createStore()
  })

  it('should initialize categories, expenses, and incomes from services', () => {
    const store = getStore()

    expect(store.categories.value).toEqual([fakeCategory])
    expect(store.expenses.value).toEqual([fakeExpense])
    expect(store.incomes.value).toEqual([fakeIncome])
  })

  it('should update canonical expenses and incomes through mutators', () => {
    const store = getStore()
    const fakeSecondExpense = {
      ...fakeExpense,
      id: 'expense-2',
      name: 'Restaurant',
    }
    const fakeUpdatedIncome = {
      ...fakeIncome,
      name: 'Updated Salary',
    }

    store.addExpenses([fakeSecondExpense])
    expect(store.expenses.value).toHaveLength(2)

    store.updateExpense({ ...fakeSecondExpense, name: 'Takeout' })
    expect(store.expenses.value.find((expense) => expense.id === 'expense-2')?.name).toBe('Takeout')

    store.deleteExpense('expense-2')
    expect(store.expenses.value.find((expense) => expense.id === 'expense-2')).toBeUndefined()

    store.updateIncome(fakeUpdatedIncome)
    expect(store.incomes.value[0].name).toBe('Updated Salary')

    store.deleteIncome(fakeIncome.id)
    expect(store.incomes.value).toEqual([])
  })

  it('should keep add-table draft rows in memory only', () => {
    const store = getStore()
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem')

    store.addNewExpense({
      date: '2026-02-01',
      name: '',
      amount: 0,
      netAmount: 0,
      category: '',
      subCategory: '',
    })

    store.addNewExpense({
      date: '2026-02-01',
      name: 'Coffee',
      amount: 5,
      netAmount: 5,
      category: 'category-1',
      subCategory: '',
    })

    expect(store.newExpenses.value).toHaveLength(1)
    expect(store.newExpenses.value[0].name).toBe('Coffee')

    store.addNewIncome({ date: '2026-02-01', name: 'Bonus', amount: 200 })
    expect(store.newIncomes.value).toHaveLength(1)

    expect(mockSetItem).toHaveBeenCalled()
  })

  it('should update existing expense category names when a category is renamed', () => {
    const store = getStore()

    const fakeUpdatedCategory: ExpenseCategory = {
      ...fakeCategory,
      name: 'Food & Dining',
    }

    store.updateCategory(fakeUpdatedCategory)

    expect(store.expenses.value[0].category.name).toBe('Food & Dining')
  })

  it('should update existing expense subCategory names when a subCategory is renamed', () => {
    const store = getStore()
    const fakeSubCategory = {
      id: 'sub-category-1',
      userId: 'user-1',
      accountId: 'account-1',
      name: 'Groceries',
      categoryId: fakeCategory.id,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    }

    store.updateCategory({
      ...fakeCategory,
      subCategories: [fakeSubCategory],
    })

    store.setExpenses([
      {
        ...fakeExpense,
        category: {
          ...fakeCategory,
          subCategories: [fakeSubCategory],
        },
        subCategory: fakeSubCategory,
      },
    ])

    store.updateSubCategory(fakeCategory.id, {
      ...fakeSubCategory,
      name: 'Weekly groceries',
    })

    expect(store.expenses.value[0].subCategory?.name).toBe('Weekly groceries')
  })

  it('should set summary period to the latest expense month when defaulting is applied', () => {
    const store = getStore()
    const fakeOlderExpense = {
      ...fakeExpense,
      id: 'expense-older',
      date: '2025-12-12',
    }
    const fakeFutureExpense = {
      ...fakeExpense,
      id: 'expense-future',
      date: '2027-03-02',
    }

    store.setExpenses([fakeOlderExpense, fakeExpense, fakeFutureExpense])

    store.applyLatestExpenseSummaryPeriodDefault()

    expect(store.selectedYear.value).toBe(2027)
    expect(store.selectedMonth.value).toBe(2)
  })

  it('should not overwrite summary period when manually selected by user', () => {
    const store = getStore()
    const fakeLatestExpense = {
      ...fakeExpense,
      id: 'expense-latest',
      date: '2026-11-01',
    }

    store.setExpenses([fakeExpense, fakeLatestExpense])
    store.selectedYear.value = 2026
    store.selectedMonth.value = 0
    store.markSummaryPeriodAsManuallySelected()

    store.applyLatestExpenseSummaryPeriodDefault()

    expect(store.selectedYear.value).toBe(2026)
    expect(store.selectedMonth.value).toBe(0)
  })

  it('should fallback to current month and year when no expenses exist', () => {
    const store = getStore()
    const currentDate = new Date()

    store.setExpenses([])
    store.applyLatestExpenseSummaryPeriodDefault()

    expect(store.selectedYear.value).toBe(currentDate.getUTCFullYear())
    expect(store.selectedMonth.value).toBe(currentDate.getUTCMonth())
  })
})
