import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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

  it('should initialize categories expenses and incomes from services', () => {
    const store = getStore()

    expect(store.categories.value).toEqual([fakeCategory])
    expect(store.expenses.value).toEqual([fakeExpense])
    expect(store.incomes.value).toEqual([fakeIncome])
  })

  it('should expose all expected store domains and mutators', () => {
    const store = getStore()

    expect(store.categories).toBeDefined()
    expect(store.expenses).toBeDefined()
    expect(store.incomes).toBeDefined()
    expect(store.newExpenses).toBeDefined()
    expect(store.newIncomes).toBeDefined()
    expect(store.expenseDuplicates).toBeDefined()
    expect(store.incomeDuplicates).toBeDefined()
    expect(store.isExpenseDuplicatesPresent).toBeDefined()
    expect(store.isIncomeDuplicatesPresent).toBeDefined()
    expect(store.selectedMonth).toBeDefined()
    expect(store.selectedYear).toBeDefined()

    expect(typeof store.addExpenses).toBe('function')
    expect(typeof store.addIncomes).toBe('function')
    expect(typeof store.addCategory).toBe('function')
    expect(typeof store.addSubCategory).toBe('function')
    expect(typeof store.addNewExpense).toBe('function')
    expect(typeof store.addNewIncome).toBe('function')
  })

  it('should update duplicate refs reactively when draft rows are edited', async () => {
    const store = getStore()

    store.newExpenses.value = [
      {
        date: '2026-01-10',
        name: 'Coffee',
        amount: 10,
        netAmount: 10,
        category: fakeCategory.id,
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: ' coffee ',
        amount: 10,
        netAmount: 10,
        category: fakeCategory.id,
        subCategory: '',
      },
    ]

    await nextTick()

    expect(store.expenseDuplicates.value).toHaveLength(2)
    expect(store.isExpenseDuplicatesPresent.value).toBe(true)
    expect(store.isIncomeDuplicatesPresent.value).toBe(false)

    store.newExpenses.value[1] = {
      ...store.newExpenses.value[1],
      name: 'Restaurant',
    }

    await nextTick()

    expect(store.expenseDuplicates.value).toHaveLength(0)
    expect(store.isExpenseDuplicatesPresent.value).toBe(false)
    expect(store.isIncomeDuplicatesPresent.value).toBe(false)
  })
})
