import type { Expense, NewExpense } from '@/types/expenseData'

export interface Store {
  getAllExpenses: () => Expense[]
  getExpensesForDateRange: (
    dateRange: [number, number],
    filters?: {
      category?: string
      subcategory?: string
    },
    options?: {
      inclusive: boolean
    },
  ) => Expense[]
  addExpense: (newExpense: NewExpense) => Expense[]
  updateExpense: (expenseDataToUpdate: Partial<Expense>, key: string) => void
  addCategories: (newCategories: string[]) => string[]
  addSubcategoriesToCategory: (newSubcategories: string[], categoryToAddTo: string) => string[]
  getCategories: () => string[]
  getSubcategories: () => string[]
  getSubcategoriesForCategory: (category: string) => string[]
  deleteCategory: (categoryToDelete: string) => void
  deleteSubcategory: (subcategoryToDelete: string, category: string) => void
}
