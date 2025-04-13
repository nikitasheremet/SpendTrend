import { splitString } from '@/helpers/splitString'
import { addNewSubcategories } from '@/service/categories/addNewSubcategories'
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
      const newSubcategories = splitString(newSubcategoriesValue.value)
      if (!newSubcategories) {
        throw new Error('Subcategory name cannot be empty')
      }
      const orderedSubcategories = newSubcategories.sort((a, b) => a.localeCompare(b))
      await addNewSubcategories(category, orderedSubcategories)

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
