import { expenseCategoriesTable } from '../../db/schema'
import { ExpenseSubCategory } from '../expenseSubCategory/expenseSubCategory'

export type ExpenseCategory = {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  subCategories: ExpenseSubCategory[]
  createdAt: Date
  updatedAt: Date
}

export type ExpenseCategoryDbRow = typeof expenseCategoriesTable.$inferSelect
