import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { deleteSubcategory as serviceDeleteSubcategory } from '@/service/categories/deleteSubCategory'

export function useManageSubCategories(category: ExpenseCategory): {
  subCategories: Ref<ExpenseSubCategory[]>
  subCategoryAdded: (newSubCategory: ExpenseSubCategory) => void
  deleteSubCategory: (subCategoryToDelete: ExpenseSubCategory) => Promise<void>
  error: Ref<Error | undefined>
} {
  const subCategories = ref<ExpenseSubCategory[]>(category.subCategories)
  const error = ref<Error | undefined>(undefined)
  const subCategoryAdded = (newSubCategory: ExpenseSubCategory) => {
    subCategories.value = [...subCategories.value, newSubCategory]
  }
  const deleteSubCategory = async (subCategoryToDelete: ExpenseSubCategory) => {
    const isDeleteConfirmed = window.confirm(
      'Are you sure you want to delete this subcategory? It will remove this subcategory from all expenses. You will need to manually re-categorize them if desired. This action cannot be undone.',
    )
    if (!isDeleteConfirmed) {
      return
    }
    try {
      await serviceDeleteSubcategory(category, subCategoryToDelete)
      subCategories.value = subCategories.value.filter(
        (subCategory) => subCategory !== subCategoryToDelete,
      )
    } catch (err) {
      error.value = err as Error
    }
  }
  return {
    subCategories,
    subCategoryAdded,
    deleteSubCategory,
    error,
  }
}
