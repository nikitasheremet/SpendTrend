import { getCategories } from '@/service/categories/getCategories'
import type { Category } from '@/types/expenseData'
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'

export function useCategoriesInExpenseData(): {
  categories: Ref<Category[]>
  categoryNames: ComputedRef<string[]>
  getSubcategories: (categoryName?: string) => string[]
} {
  const categories = ref<Category[]>([])

  onMounted(() => {
    getCategories().then((response) => {
      categories.value = response
    })
  })

  const categoryNames = computed(() => {
    return categories.value.map((category) => category.name)
  })
  function getSubcategories(categoryName?: string): string[] {
    const selectedCategoryObject = categories.value.find(
      (category) => category.name === categoryName,
    )
    if (selectedCategoryObject) {
      return selectedCategoryObject.subcategories
    }
    return []
  }
  return {
    categories,
    categoryNames,
    getSubcategories,
  }
}
