import { describe, expect, it } from 'vitest'
import type { Expense, ExpenseCategory, NewExpense } from '@/types/expenseData'
import { createStoreExpenseDuplicates } from '../storeExpenseDuplicates'

const fakeCategory: ExpenseCategory = {
  id: 'category-1',
  userId: 'user-1',
  accountId: 'account-1',
  name: 'Food',
  subCategories: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const fakeExistingExpense: Expense = {
  id: 'expense-existing-1',
  userId: 'user-1',
  accountId: 'account-1',
  date: '2026-01-10',
  name: 'Groceries',
  netAmount: 50,
  amount: 50,
  paidBackAmount: 0,
  category: fakeCategory,
  subCategory: undefined,
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-01-10'),
}

describe('when expense duplicates are tracked', () => {
  it('should detect duplicates across new draft expenses', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeDraftExpenses: NewExpense[] = [
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: '  groceries  ',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
    ]

    storeExpenseDuplicates.rebuildExpenseDuplicates(fakeDraftExpenses)

    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(2)
    expect(storeExpenseDuplicates.expenseDuplicates.value[0].isPresentInNew).toBe(true)
    expect(storeExpenseDuplicates.expenseDuplicates.value[0].isPresentInExisting).toBe(false)
  })

  it('should denote duplicates from both new and existing sources', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeDraftExpenses: NewExpense[] = [
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
    ]

    storeExpenseDuplicates.syncExistingExpenses([fakeExistingExpense])
    storeExpenseDuplicates.rebuildExpenseDuplicates(fakeDraftExpenses)

    const duplicateEntry = storeExpenseDuplicates.expenseDuplicates.value[0]

    expect(duplicateEntry.isPresentInNew).toBe(true)
    expect(duplicateEntry.isPresentInExisting).toBe(true)
    expect(duplicateEntry.matches.some((match) => match.source === 'new')).toBe(true)
    expect(duplicateEntry.matches.some((match) => match.source === 'existing')).toBe(true)
  })

  it('should remove duplicate entries when edited row no longer matches', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeDraftExpenses: NewExpense[] = [
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
    ]

    storeExpenseDuplicates.rebuildExpenseDuplicates(fakeDraftExpenses)
    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(2)

    fakeDraftExpenses[1] = {
      ...fakeDraftExpenses[1],
      name: 'Restaurant',
    }

    storeExpenseDuplicates.recheckDraftExpenseRow(1, fakeDraftExpenses)

    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(0)
  })

  it('should ignore incomplete draft expenses from duplicate checks', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeDraftExpenses: NewExpense[] = [
      {
        date: '2026-01-10',
        name: '',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: '',
        amount: 50,
        netAmount: 50,
        category: fakeCategory.id,
        subCategory: '',
      },
    ]

    storeExpenseDuplicates.rebuildExpenseDuplicates(fakeDraftExpenses)

    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(0)
  })

  it('should detect duplicates for uncategorized draft expenses', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeDraftExpenses: NewExpense[] = [
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: '',
        subCategory: '',
      },
      {
        date: '2026-01-10',
        name: 'groceries',
        amount: 50,
        netAmount: 50,
        category: undefined,
        subCategory: '',
      },
    ]

    storeExpenseDuplicates.rebuildExpenseDuplicates(fakeDraftExpenses)

    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(2)
  })

  it('should match uncategorized draft expenses against uncategorized existing expenses', () => {
    const storeExpenseDuplicates = createStoreExpenseDuplicates()
    const fakeUncategorizedExistingExpense: Expense = {
      ...fakeExistingExpense,
      id: 'expense-existing-uncategorized-1',
      category: undefined,
    }

    storeExpenseDuplicates.syncExistingExpenses([fakeUncategorizedExistingExpense])
    storeExpenseDuplicates.rebuildExpenseDuplicates([
      {
        date: '2026-01-10',
        name: 'Groceries',
        amount: 50,
        netAmount: 50,
        category: '',
        subCategory: '',
      },
    ])

    expect(storeExpenseDuplicates.expenseDuplicates.value).toHaveLength(1)
    expect(storeExpenseDuplicates.expenseDuplicates.value[0].isPresentInExisting).toBe(true)
  })
})
