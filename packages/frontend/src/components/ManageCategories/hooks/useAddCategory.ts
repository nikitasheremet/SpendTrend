import { addNewCategory } from '@/service/categories/addNewCategories'
import { getStore } from '@/store/store'
import { ref, type Ref } from 'vue'

export function useAddCategory(): {
  newCategoriesValue: Ref<string>
  addCategory: () => void
  error: Ref<Error | undefined>
} {
  const newCategoriesValue = ref<string>('')
  const error = ref<Error | undefined>(undefined)

  async function addCategory() {
    const trimmedValue = newCategoriesValue.value.trim()
    if (trimmedValue === '') {
      error.value = new Error('Category name cannot be empty')
      return
    }

    try {
      const newCategoryAdded = await addNewCategory({ name: newCategoriesValue.value.trim() })
      getStore().addCategory(newCategoryAdded)

      newCategoriesValue.value = ''
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    newCategoriesValue,
    addCategory,
    error,
  }
}
