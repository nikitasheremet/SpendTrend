import { expenseSubCategoriesTable } from '../../db/schema'

export interface ExpenseSubCategory {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  categoryId: string // UUID
  createdAt: Date
  updatedAt: Date
}

export type ExpenseSubCategoryDbRow = typeof expenseSubCategoriesTable.$inferSelect
