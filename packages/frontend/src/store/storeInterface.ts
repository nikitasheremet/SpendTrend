import { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { AccountDetails } from '../types/account/account'

export interface Store {
  getAccountDetails: () => Promise<AccountDetails>
  categories: ExpenseCategory[]
  deleteCategory: (categoryId: string) => void
  addCategory: (newCategory: ExpenseCategory) => void
  updateCategory: (updatedCategory: ExpenseCategory) => void
  addSubCategory: (categoryId: string, newSubCategoryName: ExpenseSubCategory) => void
  updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => void
}
