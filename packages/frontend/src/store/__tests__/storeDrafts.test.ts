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

describe('when draft rows are managed', () => {
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

  it('should overwrite the initial empty expense draft row', () => {
    const store = getStore()

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
  })

  it('should overwrite the initial empty income draft row', () => {
    const store = getStore()

    store.addNewIncome({ date: '2026-02-01', name: '', amount: 0 })
    store.addNewIncome({ date: '2026-02-01', name: 'Bonus', amount: 200 })

    expect(store.newIncomes.value).toHaveLength(1)
    expect(store.newIncomes.value[0].name).toBe('Bonus')
  })

  it('should persist draft changes to localStorage', () => {
    const store = getStore()
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem')

    store.addNewIncome({ date: '2026-02-01', name: 'Bonus', amount: 200 })
    store.clearNewIncomes()

    expect(mockSetItem).toHaveBeenCalled()
  })
})
