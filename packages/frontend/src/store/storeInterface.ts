import { Ref } from 'vue'
import { ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'
import { AccountDetails } from '../types/account/account'
import { NewIncome } from '@/types/income/income'

export interface Store {
  getAccountDetails: () => Promise<AccountDetails>
  categories: Ref<ExpenseCategory[]>
  deleteCategory: (categoryId: string) => void
  addCategory: (newCategory: ExpenseCategory) => void
  updateCategory: (updatedCategory: ExpenseCategory) => void
  addSubCategory: (categoryId: string, newSubCategoryName: ExpenseSubCategory) => void
  updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => void
  newExpenses: Ref<NewExpense[]>
  newIncomes: Ref<NewIncome[]>
  addNewExpense: (expense: NewExpense) => void
  addNewIncome: (income: NewIncome) => void
  clearNewExpenses: () => void
  clearNewIncomes: () => void
  selectedMonth: Ref<number>
  selectedYear: Ref<number>
}
