import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore'
import type { Category } from '@/types/expenseData'

export async function deleteCategory(categoryToDelete: Category): Promise<Category> {
  return new Promise<Category>((resolve, reject) => {
    const categoriesObjectStore = writeExpenseCategoriesTransaction()
    const deleteRequest = categoriesObjectStore.delete(categoryToDelete.name)
    deleteRequest.onsuccess = () => {
      resolve(categoryToDelete)
    }
    deleteRequest.onerror = () => {
      reject(deleteRequest.error)
    }
  })
}
