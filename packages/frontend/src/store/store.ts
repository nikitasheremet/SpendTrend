import { reactive } from 'vue'
import type { Store } from './storeInterface'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { Category, ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { a } from 'vitest/dist/chunks/suite.B2jumIFP.js'

let store: Store

export async function createStore() {
  store = reactive<Store>({
    getAccountDetails: async () => {
      const session = await authClient.getSession()

      if (!session || !session?.data?.user) {
        throw new Error('User not authenticated')
      }
      return {
        userId: session.data.user.id,
        // @ts-ignore -- This is defined in the custom session callback in the backend
        accountId: session.data.user.accountId,
      }
    },
    categories: [],
    deleteCategory: (categoryId: string) => {
      store.categories = store.categories.filter((category) => category.id !== categoryId)
    },
    addCategory: (newCategory: ExpenseCategory) => {
      store.categories.push(newCategory)
      store.categories = store.categories.sort((a, b) => a.name.localeCompare(b.name))
    },
    addSubCategory: (categoryId: string, newSubCategory: ExpenseSubCategory) => {
      const category = store.categories.find((cat) => cat.id === categoryId)
      if (category) {
        category.subCategories.push(newSubCategory)
        category.subCategories = category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
  })
  try {
    store.categories = await fetchCategories()
  } catch (error) {
    console.error('Error fetching categories during store initialization:', error)
  }
}

export function getStore(): Store {
  return store
}

async function fetchCategories() {
  const fetchedCategories = await getCategories()
  return fetchedCategories
}
