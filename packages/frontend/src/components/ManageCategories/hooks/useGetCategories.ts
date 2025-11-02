import { getCategories } from '@/service/categories/getCategories'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'
import { onMounted, ref, watch, type Ref } from 'vue'

export function useGetCategories(): {
  categories: Ref<ExpenseCategory[]>
  error: Ref<Error | undefined>
  newCategoriesAdded: (newCategory: ExpenseCategory) => void
  categoryDeleted: (categoryDeleted: ExpenseCategory) => void
} {
  const store = getStore()
  const categories = ref<ExpenseCategory[]>(store.categories)
  const error = ref<Error | undefined>(undefined)

  watch(
    () => store.categories,
    (newCategories) => {
      categories.value = newCategories
    },
  )

  function newCategoriesAdded(newCategories: ExpenseCategory) {
    const updatedCategories = [...categories.value, newCategories].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    categories.value = updatedCategories
  }

  function categoryDeleted(categoryDeleted: ExpenseCategory) {
    categories.value = categories.value.filter((category) => category.name !== categoryDeleted.name)
  }

  return {
    categories,
    error,
    newCategoriesAdded,
    categoryDeleted,
  }
}
