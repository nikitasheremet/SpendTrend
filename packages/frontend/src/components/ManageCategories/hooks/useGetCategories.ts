import { getCategories } from '@/service/categories/getCategories'
import type { Category, ExpenseCategory } from '@/types/expenseData'
import { onMounted, ref, type Ref } from 'vue'

export function useGetCategories(): {
  categories: Ref<ExpenseCategory[]>
  error: Ref<Error | undefined>
  newCategoriesAdded: (newCategory: ExpenseCategory) => void
  categoryDeleted: (categoryDeleted: Category) => void
} {
  const categories = ref<ExpenseCategory[]>([])
  const error = ref<Error | undefined>(undefined)

  async function fetchCategories() {
    try {
      getCategories().then((response) => {
        categories.value = response as unknown as ExpenseCategory[]
      })
    } catch (err) {
      error.value = err as Error
    }
  }

  onMounted(() => {
    fetchCategories()
  })

  function newCategoriesAdded(newCategories: ExpenseCategory) {
    const updatedCategories = [...categories.value, newCategories].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    categories.value = updatedCategories
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
