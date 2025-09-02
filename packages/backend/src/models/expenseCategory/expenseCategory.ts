import { expenseCategoriesTable } from '../../db/schema'

export type ExpenseCategory = {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  subcategories: string[]
  createdAt: string // Timestamp with timezone
  updatedAt: string // Timestamp with timezone
}

export type ExpenseCategoriesDbRow = typeof expenseCategoriesTable.$inferSelect
