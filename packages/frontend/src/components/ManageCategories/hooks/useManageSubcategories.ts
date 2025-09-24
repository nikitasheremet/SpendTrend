import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { deleteSubCategory as serviceDeleteSubCategory } from '@/service/categories/deleteSubCategory'

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
    console.log('1')
    const isDeleteConfirmed = window.confirm(
      'Are you sure you want to delete this subcategory? It will remove this subcategory from all expenses. You will need to manually re-categorize them if desired. This action cannot be undone.',
    )
    console.log('2')
    if (!isDeleteConfirmed) {
      console.log('3')
      return
    }
    try {
      console.log('4')
      await serviceDeleteSubCategory(subCategoryToDelete.id)
      console.log('Deleted subcategory:', subCategoryToDelete, subCategories.value)
      subCategories.value = subCategories.value.filter(
        (subCategory) => subCategory.id !== subCategoryToDelete.id,
      )
      console.log('Updated subcategories:', subCategories.value)
    } catch (err) {
      console.error('Error deleting subcategory:', err)
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
