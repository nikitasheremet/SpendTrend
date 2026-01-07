import { ExpenseCategory } from '../expenseCategory/models'
import { ExpenseSubCategory } from '../expenseSubCategory/models'

export interface Expense {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  netAmount: number
  date: string // YYYY-MM-DD
  category: ExpenseCategory
  subCategory?: ExpenseSubCategory
  paidBackAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface NewExpense {
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  netAmount: number
  date: string // YYYY-MM-DD
  categoryId: string // categoryId
  subCategoryId?: string // subCategoryId
  paidBackAmount: number
}
