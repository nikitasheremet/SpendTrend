import { writeExpenseCategoriesTransaction } from '@/localDb/schema/expenseCategoriesObjectStore'
import type { Category } from '@/types/expenseData'

export async function addCategories(newCategories: Category[]): Promise<Category[]> {
  return new Promise<Category[]>(async (resolve, reject) => {
    const categoriesObjectStore = writeExpenseCategoriesTransaction()
    try {
      await Promise.all(
        newCategories.map((category) => {
          return new Promise<void>((resolve, reject) => {
            const addCategoryRequest = categoriesObjectStore.add(category)
            addCategoryRequest.onsuccess = () => {
              resolve()
            }
            addCategoryRequest.onerror = () => {
              reject(addCategoryRequest.error)
            }
          })
        }),
      )
      resolve(newCategories)
    } catch (err) {
      reject(err)
    }
  })
}
