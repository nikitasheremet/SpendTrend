import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore, getStore } from '../store'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getAllIncomes } from '@/service/income/getAllIncomes'
import type { Expense, ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
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

describe('when categories and subCategories are changed', () => {
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
    const fakeSubCategory: ExpenseSubCategory = {
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

  it('should add and remove categories', () => {
    const store = getStore()

    const fakeNewCategory: ExpenseCategory = {
      ...fakeCategory,
      id: 'category-2',
      name: 'Utilities',
    }

    store.addCategory(fakeNewCategory)
    expect(store.categories.value.some((category) => category.id === fakeNewCategory.id)).toBe(true)

    store.deleteCategory(fakeNewCategory.id)
    expect(store.categories.value.some((category) => category.id === fakeNewCategory.id)).toBe(
      false,
    )
  })

  it('should clear existing expense category and subCategory when category is deleted', () => {
    const store = getStore()

    const fakeSubCategory: ExpenseSubCategory = {
      id: 'sub-category-1',
      userId: 'user-1',
      accountId: 'account-1',
      name: 'Groceries',
      categoryId: fakeCategory.id,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    }

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

    store.deleteCategory(fakeCategory.id)

    expect(store.expenses.value[0].category).toBeUndefined()
    expect(store.expenses.value[0].subCategory).toBeUndefined()
  })

  it('should clear draft expense category and subCategory when category is deleted', () => {
    const store = getStore()

    store.newExpenses.value = [
      {
        date: '2026-01-10',
        name: 'Draft Groceries',
        amount: 25,
        netAmount: 25,
        category: fakeCategory.id,
        subCategory: 'sub-category-1',
      },
    ]

    store.deleteCategory(fakeCategory.id)

    expect(store.newExpenses.value[0].category).toBe('')
    expect(store.newExpenses.value[0].subCategory).toBe('')
  })
})
