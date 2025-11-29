import { addNewSubcategory } from '@/service/categories/addNewSubCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { useLoading } from '@/helpers/hooks/useLoading'

export function useAddSubCategory(category: ExpenseCategory): {
  newSubCategoryValue: Ref<string>
  addSubCategory: () => Promise<void>
  error: Ref<Error | undefined>
  loading: Ref<boolean>
} {
  const newSubCategoryValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)
  const { loading, startLoading, stopLoading } = useLoading()

  async function addSubCategory() {
    startLoading()
    try {
      if (!newSubCategoryValue.value) {
        throw new Error('SubCategory name cannot be empty')
      }
      const newSubCategory = await addNewSubcategory(category.id, newSubCategoryValue.value)
      getStore().addSubCategory(category.id, newSubCategory)
      newSubCategoryValue.value = ''
      error.value = undefined
    } catch (err) {
      error.value = err as Error
    } finally {
      stopLoading()
    }
  }

  return {
    newSubCategoryValue,
    addSubCategory,
    error,
    loading,
  }
}
