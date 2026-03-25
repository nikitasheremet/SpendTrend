import { getCategories } from '@/service/categories/getCategories'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getAllIncomes } from '@/service/income/getAllIncomes'
import type { Expense, ExpenseCategory } from '@/types/expenseData'
import type { Income } from '@/types/income/income'

export interface InitialStoreData {
  categories: ExpenseCategory[]
  expenses: Expense[]
  incomes: Income[]
}

async function fetchCategories() {
  return getCategories()
}

async function fetchExpenses() {
  return getExpenses()
}

async function fetchIncomes() {
  return getAllIncomes()
}

export async function fetchInitialStoreData(): Promise<InitialStoreData> {
  const [categories, expenses, incomes] = await Promise.all([
    fetchCategories(),
    fetchExpenses(),
    fetchIncomes(),
  ])

  return {
    categories,
    expenses,
    incomes,
  }
}
