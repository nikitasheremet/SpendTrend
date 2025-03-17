import type { Category, Expense, NewExpense } from '@/types/expenseData'
import { reactive } from 'vue'
import { fakeExpenseData } from './fakeData'
import type { Store } from './storeInterface'

function createStore() {
  let expenses: Expense[] = fakeExpenseData
  let categories: Category[] = [
    { name: 'Food', subCategories: ['N + N', 'Groceries'] },
    { name: 'Home Core', subCategories: ['Mortgage', 'Taxes'] },
    { name: 'Subscription', subCategories: ['Netflix', 'Prime'] },
    { name: 'Car', subCategories: ['Loan', 'Parking'] },
  ]

  return reactive<Store>({
    getAllExpenses(order: 'asc' | 'desc' = 'desc') {
      if (order === 'asc') {
        return expenses
      }
      const sortedDescExpenses = [...expenses]
      sortedDescExpenses.sort((a, b) => b.date - a.date)
      return sortedDescExpenses
    },
    getExpensesForDateRange(dateRange, filters, options) {
      const [startDate, endDate] = dateRange
      const inclusive = options?.inclusive ?? true
      if (inclusive) {
        return expenses.filter((expense) => {
          const isWithinDateRange = expense.date >= startDate && expense.date <= endDate
          if (filters?.category && filters?.subcategory) {
            return (
              isWithinDateRange &&
              expense.subCategory === filters.subcategory &&
              expense.category === filters.category
            )
          }
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
      const categoryNames = categories.map((category) => category.name)
      return categoryNames
    },
    getSubcategories() {
      const subcategories = categories.flatMap((category) => category.subCategories)
      return subcategories
    },
    addCategories(newCategoryNames: string[]): string[] {
      const newCategories = newCategoryNames.map((categoryName) => ({
        name: categoryName,
        subCategories: [],
      }))
      categories = [...categories, ...newCategories]
      return this.getCategories()
    },
    addSubcategoriesToCategory(newSubcategories: string[], categoryToAddTo: string): string[] {
      const categoryIndex = categories.findIndex((category) => category.name === categoryToAddTo)
      if (categoryIndex === -1) {
        throw new Error('Category not found')
      }
      const category = categories[categoryIndex]
      const subcategories = category.subCategories
      category.subCategories = [...subcategories, ...newSubcategories]

      return this.getSubcategories()
    },
    getSubcategoriesForCategory(category: string) {
      const categoryIndex = categories.findIndex((categoryData) => categoryData.name === category)
      if (categoryIndex === -1) {
        throw new Error('Category not found')
      }
      return categories[categoryIndex].subCategories
    },
    deleteCategory(categoryToDelete: string) {
      const categoryIndex = categories.findIndex(
        (categoryData) => categoryData.name === categoryToDelete,
      )
      if (categoryIndex === -1) {
        throw new Error('Category not found')
      }
      categories.splice(categoryIndex, 1)
    },
    deleteSubcategory(subcategoryToDelete: string, category: string) {
      const categoryIndex = categories.findIndex((categoryData) => categoryData.name === category)
      if (categoryIndex === -1) {
        throw new Error('Category not found')
      }
      const subcategoryIndex = categories[categoryIndex].subCategories.findIndex(
        (subcategory) => subcategory === subcategoryToDelete,
      )
      if (subcategoryIndex === -1) {
        throw new Error('Subcategory not found')
      }
      categories[categoryIndex].subCategories.splice(subcategoryIndex, 1)
    },
    deleteExpense(key: string) {
      const expenseIndex = expenses.findIndex((expense) => expense.id === key)
      if (expenseIndex === -1) {
        throw new Error('Expense not found')
      }
      expenses.splice(expenseIndex, 1)
    },
  })
}

export const store = createStore()
