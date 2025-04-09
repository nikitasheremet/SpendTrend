import type { Category } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { deleteSubcategory as serviceDeleteSubcategory } from '@/service/categories/deleteSubcategory'

export function useManageSubcategories(category: Category): {
  subcategories: Ref<string[]>
  subcategoriesAdded: (newSubcategory: string[]) => void
  deleteSubcategory: (subcategoryToDelete: string) => Promise<void>
  error: Ref<Error | undefined>
} {
  const subcategories = ref<string[]>(category.subcategories)
  const error = ref<Error | undefined>(undefined)
  const subcategoriesAdded = (newSubcategories: string[]) => {
    subcategories.value = [...subcategories.value, ...newSubcategories]
  }
  const deleteSubcategory = async (subcategoryToDelete: string) => {
    let isDeleteConfirmed = window.confirm(
      'Are you sure you want to delete this subcategory? It will remove this subcategory from all expenses. You will need to manually re-categorize them if desired. This action cannot be undone.',
    )
    if (!isDeleteConfirmed) {
      return
    }
    try {
      await serviceDeleteSubcategory(category, subcategoryToDelete)
      subcategories.value = subcategories.value.filter(
        (subcategory) => subcategory !== subcategoryToDelete,
      )
    } catch (err) {
      error.value = err as Error
    }
  }
  return {
    subcategories,
    subcategoriesAdded,
    deleteSubcategory,
    error,
  }
}
