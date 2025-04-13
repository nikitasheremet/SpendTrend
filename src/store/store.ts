import type { Expense, NewExpense } from '@/types/expenseData'
import { reactive } from 'vue'
import type { Store } from './storeInterface'

function createStore() {
  // let expenses: Expense[] = fakeExpenseData
  // let categories: Category[] = [
  //   { name: 'Food', subCategories: ['N + N', 'Groceries'] },
  //   { name: 'Home Core', subCategories: ['Mortgage', 'Taxes'] },
  //   { name: 'Subscription', subCategories: ['Netflix', 'Prime'] },
  //   { name: 'Car', subCategories: ['Loan', 'Parking'] },
  // ]

  return reactive<Store>({} as Store)
  // {
  // async getAllExpenses(order: 'asc' | 'desc' = 'desc') {
  //   const savedExpenses = await getExpenses()
  //   if (order === 'asc') {
  //     return savedExpenses
  //   }
  //   const sortedDescExpenses = [...savedExpenses]
  //   sortedDescExpenses.sort((a, b) => b.date - a.date)
  //   return sortedDescExpenses
  // },
  // async getExpensesForDateRange(dateRange, filters, options) {
  //   const savedExpenses = await getExpenses()
  //   const [startDate, endDate] = dateRange
  //   const inclusive = options?.inclusive ?? true
  //   // const savedExpenses = await getExpenses()
  //   if (inclusive) {
  //     return savedExpenses.filter((expense) => {
  //       const isWithinDateRange = expense.date >= startDate && expense.date <= endDate
  //       if (filters?.category && filters?.subcategory) {
  //         return (
  //           isWithinDateRange &&
  //           expense.subCategory === filters.subcategory &&
  //           expense.category === filters.category
  //         )
  //       }
  //       if (filters?.category) {
  //         return isWithinDateRange && expense.category === filters.category
  //       }
  //       return isWithinDateRange
  //     })
  //   }
  //   return savedExpenses.filter((expense) => expense.date > startDate && expense.date < endDate)
  // },
  // async addExpense(newExpense: NewExpense) {
  //   await saveExpense(newExpense)
  //   return expenses
  // },
  // async updateExpense(expenseDataToUpdate, key) {
  //   await updateExpense(expenseDataToUpdate, key)
  // },
  // getCategories() {
  //   const categoryNames = categories.map((category) => category.name)
  //   return categoryNames
  // },
  // getSubcategories() {
  //   const subcategories = categories.flatMap((category) => category.subCategories)
  //   return subcategories
  // },
  // addCategories(newCategoryNames: string[]): string[] {
  //   const newCategories = newCategoryNames.map((categoryName) => ({
  //     name: categoryName,
  //     subCategories: [],
  //   }))
  //   categories = [...categories, ...newCategories]
  //   return this.getCategories()
  // },
  // addSubcategoriesToCategory(newSubcategories: string[], categoryToAddTo: string): string[] {
  //   const categoryIndex = categories.findIndex((category) => category.name === categoryToAddTo)
  //   if (categoryIndex === -1) {
  //     throw new Error('Category not found')
  //   }
  //   const category = categories[categoryIndex]
  //   const subcategories = category.subCategories
  //   category.subCategories = [...subcategories, ...newSubcategories]
  //   return this.getSubcategories()
  // },
  // getSubcategoriesForCategory(category: string) {
  //   const categoryIndex = categories.findIndex((categoryData) => categoryData.name === category)
  //   if (categoryIndex === -1) {
  //     throw new Error('Category not found')
  //   }
  //   return categories[categoryIndex].subCategories
  // },
  // deleteCategory(categoryToDelete: string) {
  //   const categoryIndex = categories.findIndex(
  //     (categoryData) => categoryData.name === categoryToDelete,
  //   )
  //   if (categoryIndex === -1) {
  //     throw new Error('Category not found')
  //   }
  //   categories.splice(categoryIndex, 1)
  // },
  // deleteSubcategory(subcategoryToDelete: string, category: string) {
  //   const categoryIndex = categories.findIndex((categoryData) => categoryData.name === category)
  //   if (categoryIndex === -1) {
  //     throw new Error('Category not found')
  //   }
  //   const subcategoryIndex = categories[categoryIndex].subCategories.findIndex(
  //     (subcategory) => subcategory === subcategoryToDelete,
  //   )
  //   if (subcategoryIndex === -1) {
  //     throw new Error('Subcategory not found')
  //   }
  //   categories[categoryIndex].subCategories.splice(subcategoryIndex, 1)
  // },
  // async deleteExpense(key: string): Promise<void> {
  //   await deleteExpense(key)
  // },
  // }
}

export const store = createStore()
