import { addNewSubcategory } from '@/service/categories/addNewSubCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'

export function useAddSubCategory(category: ExpenseCategory): {
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
      getStore().addSubCategory(category.id, newSubCategory)
      newSubCategoryValue.value = ''
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
