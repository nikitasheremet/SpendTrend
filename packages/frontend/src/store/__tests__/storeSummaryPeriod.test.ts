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

describe('when summary period defaults are applied', () => {
  const mockGetSession = vi.mocked(authClient.getSession)
  const mockGetCategories = vi.mocked(getCategories)
  const mockGetExpenses = vi.mocked(getExpenses)
  const mockGetAllIncomes = vi.mocked(getAllIncomes)

  beforeEach(async () => {
    vi.resetAllMocks()
    localStorage.clear()

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

  it('should set summary period to latest expense month', () => {
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

  it('should not overwrite summary period after manual selection', () => {
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

  it('should fallback to current month and year when there are no expenses', () => {
    const store = getStore()
    const fakeCurrentDate = new Date()

    store.setExpenses([])
    store.applyLatestExpenseSummaryPeriodDefault()

    expect(store.selectedYear.value).toBe(fakeCurrentDate.getUTCFullYear())
    expect(store.selectedMonth.value).toBe(fakeCurrentDate.getUTCMonth())
  })
})
