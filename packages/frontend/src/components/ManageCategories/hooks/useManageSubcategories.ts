import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { deleteSubCategory as serviceDeleteSubCategory } from '@/service/categories/deleteSubCategory'
import { updateSubCategory as serviceUpdateSubCategory } from '@/service/categories/updateSubCategory'
import { getStore } from '@/store/store'
import { useLoading } from '@/helpers/hooks/useLoading'

export function useManageSubCategories(category: ExpenseCategory): {
  subCategories: Ref<ExpenseSubCategory[]>
  subCategoryAdded: (newSubCategory: ExpenseSubCategory) => void
  deleteSubCategory: (subCategoryToDelete: ExpenseSubCategory) => Promise<void>
  updateSubCategory: (subCategoryId: string, newName: string) => Promise<void>
  error: Ref<Error | undefined>
  loading: Ref<boolean>
} {
  const subCategories = ref<ExpenseSubCategory[]>(category.subCategories)
  const error = ref<Error | undefined>(undefined)
  const { loading, startLoading, stopLoading } = useLoading()

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
      await serviceDeleteSubCategory(subCategoryToDelete.id)
      subCategories.value = subCategories.value.filter(
        (subCategory) => subCategory.id !== subCategoryToDelete.id,
      )
    } catch (err) {
      console.error('Error deleting subcategory:', err)
      error.value = err as Error
    }
  }

  const updateSubCategory = async (subCategoryId: string, newName: string) => {
    const trimmedName = newName.trim()
    if (trimmedName === '') {
      error.value = new Error('SubCategory name cannot be empty')
      return
    }

    const currentSubCategory = subCategories.value.find((sub) => sub.id === subCategoryId)
    if (currentSubCategory && trimmedName === currentSubCategory.name) {
      error.value = new Error('SubCategory name is the same as the current name')
      return
    }

    startLoading()
    try {
      const updatedSubCategory = await serviceUpdateSubCategory(subCategoryId, trimmedName)
      getStore().updateSubCategory(category.id, updatedSubCategory)
      const subCategoryIndex = subCategories.value.findIndex((sub) => sub.id === subCategoryId)
      if (subCategoryIndex !== -1) {
        subCategories.value[subCategoryIndex] = updatedSubCategory
        subCategories.value = subCategories.value.sort((a, b) => a.name.localeCompare(b.name))
      }
      error.value = undefined
    } catch (err) {
      error.value = err as Error
    } finally {
      stopLoading()
    }
  }

  return {
    subCategories,
    subCategoryAdded,
    deleteSubCategory,
    updateSubCategory,
    error,
    loading,
  }
}
