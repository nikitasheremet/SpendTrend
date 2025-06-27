import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore'
import type { Category } from '@/types/expenseData'

export async function editCategory(newCategory: Category): Promise<Category> {
  return new Promise<Category>((resolve, reject) => {
    const categoriesObjectStore = writeExpenseCategoriesTransaction()
    const updateRequest = categoriesObjectStore.put(newCategory)
    updateRequest.onsuccess = () => {
      resolve(newCategory)
    }
    updateRequest.onerror = () => {
      reject(updateRequest.error)
    }
  })
}
