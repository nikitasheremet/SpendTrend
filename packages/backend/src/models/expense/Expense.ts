import { expensesTable } from '../../db/schema'
import { ExpenseCategory } from '../expenseCategory/expenseCategory'
import { ExpenseSubCategory } from '../expenseSubCategory/expenseSubCategory'

export interface Expense {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  netAmount: number
  date: string // YYYY-MM-DD
  category: ExpenseCategory
  subCategory: ExpenseSubCategory
  paidBackAmount: number
  createdAt: Date
  updatedAt: Date
}

export type ExpensesDbRow = typeof expensesTable.$inferSelect
