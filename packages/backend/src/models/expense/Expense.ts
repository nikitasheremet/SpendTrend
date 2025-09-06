import { ExpenseCategory } from '../expenseCategory/expenseCategory'

export interface Expense {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  amount: number
  netAmount: number
  date: string // YYYY-MM-DD
  category: ExpenseCategory
  subCategory: string
  paidBackAmount: number
  createdAt: string // Timestamp with timezone
  updatedAt: string // Timestamp with timezone
}
