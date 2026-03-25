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

describe('when expense mutators are used', () => {
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

  it('should add update and delete expenses', () => {
    const store = getStore()
    const fakeSecondExpense = {
      ...fakeExpense,
      id: 'expense-2',
      name: 'Restaurant',
    }

    store.addExpenses([fakeSecondExpense])
    expect(store.expenses.value).toHaveLength(2)

    store.updateExpense({ ...fakeSecondExpense, name: 'Takeout' })
    expect(store.expenses.value.find((expense) => expense.id === fakeSecondExpense.id)?.name).toBe(
      'Takeout',
    )

    store.deleteExpense(fakeSecondExpense.id)
    expect(
      store.expenses.value.find((expense) => expense.id === fakeSecondExpense.id),
    ).toBeUndefined()
  })

  it('should replace expense list through setExpenses', () => {
    const store = getStore()
    const fakeOnlyExpense = {
      ...fakeExpense,
      id: 'expense-only',
      name: 'Only expense',
    }

    store.setExpenses([fakeOnlyExpense])

    expect(store.expenses.value).toEqual([fakeOnlyExpense])
  })
})
