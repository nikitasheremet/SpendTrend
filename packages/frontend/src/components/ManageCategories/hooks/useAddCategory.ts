import { addNewCategory } from '@/service/categories/addNewCategories'
import { getStore } from '@/store/store'
import { ref, type Ref } from 'vue'
import { useLoading } from '@/helpers/hooks/useLoading'

export function useAddCategory(): {
  newCategoriesValue: Ref<string>
  addCategory: () => void
  error: Ref<Error | undefined>
  loading: Ref<boolean>
} {
  const newCategoriesValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)
  const { loading, startLoading, stopLoading } = useLoading()

  async function addCategory() {
    const trimmedValue = newCategoriesValue.value.trim()
    if (trimmedValue === '') {
      error.value = new Error('Category name cannot be empty')
      return
    }

    startLoading()
    try {
      const newCategoryAdded = await addNewCategory({ name: newCategoriesValue.value.trim() })
      getStore().addCategory(newCategoryAdded)

      newCategoriesValue.value = ''
      error.value = undefined
    } catch (err) {
      error.value = err as Error
    } finally {
      stopLoading()
    }
  }

  return {
    newCategoriesValue,
    addCategory,
    error,
    loading,
  }
}
