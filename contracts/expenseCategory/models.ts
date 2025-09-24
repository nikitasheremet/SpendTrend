import { ExpenseSubCategory } from '../expenseSubCategory/models'

export interface ExpenseCategory {
  id: string // UUID
  userId: string // UUID
  accountId: string // UUID
  name: string
  subCategories: ExpenseSubCategory[]
  createdAt: Date
  updatedAt: Date
}
