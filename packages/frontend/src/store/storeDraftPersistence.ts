import type { NewExpense } from '@/types/expenseData'
import type { NewIncome } from '@/types/income/income'

const STORAGE_KEY_EXPENSES = 'spendtrend_new_expenses'
const STORAGE_KEY_INCOMES = 'spendtrend_new_incomes'

export function saveExpensesToStorage(newExpenses: NewExpense[]) {
  try {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(newExpenses))
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error)
  }
}

export function saveIncomesToStorage(newIncomes: NewIncome[]) {
  try {
    localStorage.setItem(STORAGE_KEY_INCOMES, JSON.stringify(newIncomes))
  } catch (error) {
    console.error('Error saving incomes to localStorage:', error)
  }
}

export function loadExpensesFromStorage(): NewExpense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPENSES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading expenses from localStorage:', error)
    return []
  }
}

export function loadIncomesFromStorage(): NewIncome[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_INCOMES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading incomes from localStorage:', error)
    return []
  }
}
