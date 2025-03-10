import type { Expense, NewExpense } from '@/types/expenseData'

export interface Store {
  getAllExpenses: () => Expense[]
  getExpensesForDateRange: (
    dateRange: [number, number],
    filters?: {
      category?: string
    },
    options?: {
      inclusive: boolean
    },
  ) => Expense[]
  addExpense: (newExpense: NewExpense) => Expense[]
  updateExpense: (expenseDataToUpdate: Partial<Expense>, key: string) => void
  addCategories: (newCategories: string[]) => string[]
  addSubcategories: (newSubcategories: string[]) => string[]
  getCategories: () => string[]
  getSubcategories: () => string[]
}
