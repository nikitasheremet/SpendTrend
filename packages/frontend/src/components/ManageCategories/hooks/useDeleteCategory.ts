import type { ExpenseCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { deleteCategory as serviceDeleteCategory } from '@/service/categories/deleteCategory'
import { getStore } from '@/store/store'

export function useDeleteCategory(
  category: ExpenseCategory,
  categoryDeletedCallback: (categoryDeleted: ExpenseCategory) => void,
): {
  deleteCategory: () => Promise<void>
  error: Ref<Error | undefined>
} {
  const error = ref<Error | undefined>(undefined)
  async function deleteCategory() {
    const isDeleteConfirmed = window.confirm(
      'Are you sure you want to delete this category? It will leave all expenses belonging to this category uncategorized. You will need to manually re-categorize them. This action cannot be undone.',
    )
    if (!isDeleteConfirmed) {
      return
    }
    try {
      await serviceDeleteCategory(category.id)
      getStore().deleteCategory(category.id)
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    deleteCategory,
    error,
  }
}
