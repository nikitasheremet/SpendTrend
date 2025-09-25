import { getCategories } from '@/service/categories/getCategories'
import type { ExpenseCategory } from '@/types/expenseData'
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'

export function useCategoriesInExpenseData(): {
  categories: Ref<ExpenseCategory[]>
  categoryNames: ComputedRef<string[]>
  getSubcategories: (categoryId?: string) => string[]
  getCategoryName: (categoryId?: string) => string
  getCategoryId: (categoryName?: string) => string
  getSubCategoryName: (categoryId?: string, subCategoryId?: string) => string
  getSubCategoryId: (categoryId?: string, subCategoryName?: string) => string
  getCategory: (categoryName: string) => ExpenseCategory
} {
  const categories = ref<ExpenseCategory[]>([])

  onMounted(() => {
    getCategories().then((response) => {
      categories.value = response
    })
  })

  const categoryNames = computed(() => {
    return categories.value.map((category) => category.name)
  })
  function getSubcategories(categoryId?: string): string[] {
    const selectedCategoryObject = categories.value.find((category) => category.id === categoryId)
    if (selectedCategoryObject) {
      return selectedCategoryObject.subCategories.map((subCategory) => subCategory.name)
    }
    return []
  }

  function getCategoryName(categoryId?: string): string {
    return categories.value.find((category) => category.id === categoryId)?.name || ''
  }

  function getCategoryId(categoryName?: string): string {
    return categories.value.find((category) => category.name === categoryName)?.id || ''
  }

  function getSubCategoryName(categoryId?: string, subCategoryId?: string): string {
    const subCategories = categories.value.find(
      (category) => category.id === categoryId,
    )?.subCategories
    return subCategories?.find((sub) => sub.id === subCategoryId)?.name || ''
  }

  function getSubCategoryId(categoryId?: string, subCategoryName?: string): string {
    const subCategories = categories.value.find(
      (category) => category.id === categoryId,
    )?.subCategories
    return subCategories?.find((sub) => sub.name === subCategoryName)?.id || ''
  }

  function getCategory(categoryName: string): ExpenseCategory {
    return categories.value.find((category) => category.name === categoryName) as ExpenseCategory
  }

  return {
    categories,
    categoryNames,
    getSubcategories,
    getCategoryName,
    getCategoryId,
    getSubCategoryName,
    getSubCategoryId,
    getCategory,
  }
}
