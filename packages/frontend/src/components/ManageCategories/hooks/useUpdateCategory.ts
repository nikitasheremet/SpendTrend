import type { ExpenseCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { updateCategory as serviceUpdateCategory } from '@/service/categories/updateCategory'
import { getStore } from '@/store/store'
import { useLoading } from '@/helpers/hooks/useLoading'

export function useUpdateCategory(category: ExpenseCategory): {
  updateCategory: (newName: string) => Promise<void>
  error: Ref<Error | undefined>
  loading: Ref<boolean>
} {
  const error = ref<Error | undefined>(undefined)
  const { loading, startLoading, stopLoading } = useLoading()

  async function updateCategory(newName: string) {
    const trimmedName = newName.trim()
    if (trimmedName === '') {
      error.value = new Error('Category name cannot be empty')
      return
    }

    if (trimmedName === category.name) {
      error.value = new Error('Category name is the same as the current name')
      return
    }

    startLoading()
    try {
      const updatedCategory = await serviceUpdateCategory(category.id, trimmedName)
      getStore().updateCategory(updatedCategory)
      error.value = undefined
    } catch (err) {
      error.value = err as Error
    } finally {
      stopLoading()
    }
  }

  return {
    updateCategory,
    error,
    loading,
  }
}
