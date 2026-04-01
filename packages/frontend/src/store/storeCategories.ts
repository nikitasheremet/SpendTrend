import { ref, type Ref } from 'vue'
import type { Expense, ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'

export interface StoreCategoriesDomain {
  categories: Ref<ExpenseCategory[]>
  deleteCategory: (categoryId: string) => void
  addCategory: (newCategory: ExpenseCategory) => void
  updateCategory: (updatedCategory: ExpenseCategory) => void
  addSubCategory: (categoryId: string, newSubCategory: ExpenseSubCategory) => void
  updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => void
}

export function createStoreCategories(
  expensesRef: Ref<Expense[]>,
  newExpensesRef: Ref<NewExpense[]>,
): StoreCategoriesDomain {
  const categoriesRef = ref<ExpenseCategory[]>([])

  const deleteCategory = (categoryId: string) => {
    const categoryToDelete = categoriesRef.value.find((category) => category.id === categoryId)
    const categoryNameToDelete = categoryToDelete?.name

    categoriesRef.value = categoriesRef.value.filter((category) => category.id !== categoryId)

    expensesRef.value = expensesRef.value.map((expense) => {
      if (expense.category?.id !== categoryId) {
        return expense
      }

      return {
        ...expense,
        category: undefined,
        subCategory: undefined,
      }
    })

    newExpensesRef.value = newExpensesRef.value.map((newExpense) => {
      const hasDeletedCategoryId = newExpense.category === categoryId
      const hasDeletedCategoryName = Boolean(
        categoryNameToDelete && newExpense.category === categoryNameToDelete,
      )

      if (!hasDeletedCategoryId && !hasDeletedCategoryName) {
        return newExpense
      }

      return {
        ...newExpense,
        category: '',
        subCategory: '',
      }
    })
  }

  const addCategory = (newCategory: ExpenseCategory) => {
    categoriesRef.value = [...categoriesRef.value, newCategory].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }

  const updateCategory = (updatedCategory: ExpenseCategory) => {
    const categoryIndex = categoriesRef.value.findIndex(
      (category) => category.id === updatedCategory.id,
    )
    if (categoryIndex === -1) return

    const updatedCategories = [...categoriesRef.value]
    updatedCategories[categoryIndex] = updatedCategory
    categoriesRef.value = updatedCategories.sort((a, b) => a.name.localeCompare(b.name))

    expensesRef.value = expensesRef.value.map((expense) => {
      if (expense.category?.id !== updatedCategory.id) {
        return expense
      }

      const updatedSubCategory = updatedCategory.subCategories.find(
        (subCategory) => subCategory.id === expense.subCategory?.id,
      )

      return {
        ...expense,
        category: updatedCategory,
        subCategory: updatedSubCategory,
      }
    })
  }

  const addSubCategory = (categoryId: string, newSubCategory: ExpenseSubCategory) => {
    const category = categoriesRef.value.find(
      (existingCategory) => existingCategory.id === categoryId,
    )
    if (!category) return

    category.subCategories.push(newSubCategory)
    category.subCategories = category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
  }

  const updateSubCategory = (categoryId: string, updatedSubCategory: ExpenseSubCategory) => {
    const category = categoriesRef.value.find(
      (existingCategory) => existingCategory.id === categoryId,
    )
    if (!category) return

    const subCategoryIndex = category.subCategories.findIndex(
      (subCategory) => subCategory.id === updatedSubCategory.id,
    )
    if (subCategoryIndex === -1) return

    const updatedSubCategories = [...category.subCategories]
    updatedSubCategories[subCategoryIndex] = updatedSubCategory
    category.subCategories = updatedSubCategories.sort((a, b) => a.name.localeCompare(b.name))

    expensesRef.value = expensesRef.value.map((expense) => {
      if (
        expense.category?.id !== categoryId ||
        expense.subCategory?.id !== updatedSubCategory.id
      ) {
        return expense
      }

      return {
        ...expense,
        subCategory: updatedSubCategory,
      }
    })
  }

  return {
    categories: categoriesRef,
    deleteCategory,
    addCategory,
    updateCategory,
    addSubCategory,
    updateSubCategory,
  }
}
