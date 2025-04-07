import { getCategories } from '@/service/categories/getCategories'
import type { Category } from '@/types/expenseData'
import { onMounted, ref, type Ref } from 'vue'

export function useGetCategories(): {
  categories: Ref<Category[]>
  error: Ref<Error | undefined>
  newCategoriesAdded: (newCategory: Category[]) => void
  categoryDeleted: (categoryDeleted: Category) => void
} {
  const categories = ref<Category[]>([])
  const error = ref<Error | undefined>(undefined)

  async function fetchCategories() {
    try {
      getCategories().then((response) => {
        categories.value = response
      })
    } catch (err) {
      error.value = err as Error
    }
  }

  onMounted(() => {
    fetchCategories()
  })

  function newCategoriesAdded(newCategories: Category[]) {
    categories.value = [...categories.value, ...newCategories]
  }

  function categoryDeleted(categoryDeleted: Category) {
    categories.value = categories.value.filter((category) => category.name !== categoryDeleted.name)
  }

  return {
    categories,
    error,
    newCategoriesAdded,
    categoryDeleted,
  }
}
