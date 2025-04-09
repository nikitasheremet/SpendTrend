import type { Category } from '@/types/expenseData'
import { ref, type Ref } from 'vue'

export function useAddSubcategory(
  category: Category,
  subcategoryAddedCallback: (newSubcategories: string[]) => void,
): {
  newSubcategoriesValue: Ref<string>
  addSubcategory: () => Promise<void>
  error: Ref<Error | undefined>
} {
  const newSubcategoriesValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)
  async function addSubcategory() {
    try {
      const newSubcategories = newSubcategoriesValue.value
        .split(',')
        .map((subcategory) => subcategory.trim())
        .filter((subcategory) => !subcategory)
      if (newSubcategories.length === 0) {
        alert('Please enter at least one subcategory.')
        return
      }

      subcategoryAddedCallback(newSubcategories)
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    newSubcategoriesValue,
    addSubcategory,
    error,
  }
}
