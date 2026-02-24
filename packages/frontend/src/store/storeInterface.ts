import { Ref } from 'vue'
import { Expense, ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'
import { AccountDetails } from '../types/account/account'
import { Income, NewIncome } from '@/types/income/income'

export interface Store {
  getAccountDetails: () => Promise<AccountDetails>
  categories: Ref<ExpenseCategory[]>
  deleteCategory: (categoryId: string) => void
  addCategory: (newCategory: ExpenseCategory) => void
  updateCategory: (updatedCategory: ExpenseCategory) => void
  addSubCategory: (categoryId: string, newSubCategoryName: ExpenseSubCategory) => void
  updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => void
  expenses: Ref<Expense[]>
  setExpenses: (newExpenses: Expense[]) => void
  addExpenses: (newExpenses: Expense[]) => void
  updateExpense: (updatedExpense: Expense) => void
  deleteExpense: (expenseId: string) => void
  incomes: Ref<Income[]>
  setIncomes: (newIncomes: Income[]) => void
  addIncomes: (newIncomes: Income[]) => void
  updateIncome: (updatedIncome: Income) => void
  deleteIncome: (incomeId: string) => void
  newExpenses: Ref<NewExpense[]>
  newIncomes: Ref<NewIncome[]>
  addNewExpense: (expense: NewExpense) => void
  addNewIncome: (income: NewIncome) => void
  clearNewExpenses: () => void
  clearNewIncomes: () => void
  selectedMonth: Ref<number>
  selectedYear: Ref<number>
}
