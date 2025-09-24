import { getCategories } from '@/service/categories/getCategories'
import type { ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'

export function useCategoriesInExpenseData(): {
  categories: Ref<ExpenseCategory[]>
  categoryNames: ComputedRef<string[]>
  getSubcategories: (categoryId?: string) => ExpenseSubCategory[]
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
  function getSubcategories(categoryId?: string): ExpenseSubCategory[] {
    const selectedCategoryObject = categories.value.find((category) => category.id === categoryId)
    if (selectedCategoryObject) {
      return selectedCategoryObject.subCategories
    }
    return []
  }
  return {
    categories,
    categoryNames,
    getSubcategories,
  }
}
