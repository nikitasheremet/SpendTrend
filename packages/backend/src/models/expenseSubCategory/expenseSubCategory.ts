import { expenseSubCategories } from '../../db/schema'

export interface ExpenseSubCategory {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  categoryId: string // UUID
  createdAt: string // Timestamp with timezone
  updatedAt: string // Timestamp with timezone
}

export type ExpenseSubCategoryDbRow = typeof expenseSubCategories.$inferSelect
