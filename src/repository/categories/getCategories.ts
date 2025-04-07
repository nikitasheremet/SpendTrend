import {
  readExpenseCategoriesTransaction,
  type ExpenseCategoriesObjectStore,
} from '@/localDb/schema/expenseCategoriesObjectStore'
import type { Category } from '@/types/expenseData'

export async function getCategories(): Promise<Category[]> {
  return new Promise<Category[]>((resolve, reject) => {
    const categoriesObjectStore = readExpenseCategoriesTransaction()
    const getCategoriesRequest: IDBRequest<ExpenseCategoriesObjectStore[]> =
      categoriesObjectStore.getAll()
    getCategoriesRequest.onsuccess = () => {
      const categories = getCategoriesRequest.result
      resolve(mapDbCategoriesToCategories(categories))
    }
    getCategoriesRequest.onerror = () => {
      reject(getCategoriesRequest.error)
    }
  })
}

function mapDbCategoriesToCategories(dbCategories: ExpenseCategoriesObjectStore[]): Category[] {
  return dbCategories.map((category) => mapDbCategoryToCategory(category))
}
function mapDbCategoryToCategory(dbCategory: ExpenseCategoriesObjectStore): Category {
  return {
    name: dbCategory.name,
    subcategories: dbCategory.subcategories,
  }
}
