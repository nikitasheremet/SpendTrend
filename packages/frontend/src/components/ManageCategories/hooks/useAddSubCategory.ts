import { addNewSubcategory } from '@/service/categories/addNewSubCategory'
import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'

export function useAddSubCategory(
  category: ExpenseCategory,
  subCategoryAddedCallback: (newSubCategory: ExpenseSubCategory) => void,
): {
  newSubCategoryValue: Ref<string>
  addSubCategory: () => Promise<void>
  error: Ref<Error | undefined>
} {
  const newSubCategoryValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)
  async function addSubCategory() {
    try {
      if (!newSubCategoryValue.value) {
        throw new Error('SubCategory name cannot be empty')
      }
      const newSubCategory = await addNewSubcategory(category.id, newSubCategoryValue.value)

      subCategoryAddedCallback(newSubCategory)
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    newSubCategoryValue,
    addSubCategory,
    error,
  }
}
