import { addNewCategories } from '@/service/categories/addNewCategories'
import type { Category } from '@/types/expenseData'
import { ref, type Ref } from 'vue'

export function useAddCategory(addCategoryCallback: (newCategoriesAdded: Category[]) => void): {
  newCategoriesValue: Ref<string>
  addCategory: () => void
  error: Ref<Error | undefined>
} {
  const newCategoriesValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)

  async function addCategory() {
    const trimmedValue = newCategoriesValue.value.trim()
    if (trimmedValue === '') {
      error.value = new Error('Category name cannot be empty')
      return
    }

    const newCategoryNames = newCategoriesValue.value
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)

    try {
      const newCategories = newCategoryNames.map((name) => {
        return {
          name,
          subcategories: [],
        }
      })

      const newCategoriesAdded = await addNewCategories(newCategories)
      addCategoryCallback(newCategoriesAdded)

      newCategoriesValue.value = ''
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    newCategoriesValue,
    addCategory,
    error,
  }
}
