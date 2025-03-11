import type { Expense, NewExpense } from '@/types/expenseData'
import { reactive } from 'vue'
import { fakeExpenseData } from './fakeData'
import type { Store } from './storeInterface'

function createStore() {
  let expenses: Expense[] = fakeExpenseData
  let categories: string[] = ['Food', 'Home Core', 'Subscription', 'Car', 'Gift', 'Service']
  let subcategories: string[] = [
    'Groceries',
    'Mortgage',
    'Netflix',
    'Phone',
    'Loan',
    'Parking',
    'Insurance',
    'Massage',
    'Chiropractor',
  ]

  return reactive<Store>({
    getAllExpenses() {
      console.log('Getting all expenses', expenses)
      return expenses
    },
    getExpensesForDateRange(dateRange, filters, options) {
      const [startDate, endDate] = dateRange
      const inclusive = options?.inclusive ?? true
      if (inclusive) {
        return expenses.filter((expense) => {
          const isWithinDateRange = expense.date >= startDate && expense.date <= endDate
          if (filters?.category) {
            return isWithinDateRange && expense.category === filters.category
          }
          return isWithinDateRange
        })
      }
      return expenses.filter((expense) => expense.date > startDate && expense.date < endDate)
    },
    addExpense(newExpense: NewExpense) {
      const newExpenseWithId = {
        ...newExpense,
        id: `${Math.random()}`,
      }
      expenses.push(newExpenseWithId)
      return expenses
    },
    updateExpense(expenseDataToUpdate, key) {
      const existingExpenseIndex = expenses.findIndex((expense) => expense.id == key)
      if (existingExpenseIndex === -1) {
        throw new Error('Key is invalid')
      }
      const updatedExpense = { ...expenses[existingExpenseIndex!] }
      Object.entries(expenseDataToUpdate).forEach(([newDataKey, newDataValue]) => {
        const key = newDataKey as keyof typeof updatedExpense
        const value = newDataValue as (typeof updatedExpense)[typeof key]
        // @ts-ignore
        updatedExpense[key] = value
      })
      updatedExpense.netAmount = updatedExpense.amount - (updatedExpense.paidBackAmount || 0)
      expenses[existingExpenseIndex] = updatedExpense
    },
    getCategories() {
      return categories
    },
    getSubcategories() {
      return subcategories
    },
    addCategories(newCategories: string[]): string[] {
      categories = [...categories, ...newCategories]
      return categories
    },
    addSubcategories(newSubcategories): string[] {
      subcategories = [...subcategories, ...newSubcategories]
      return subcategories
    },
  })
}

export const store = createStore()
