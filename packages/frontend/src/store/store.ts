import { reactive, ref } from 'vue'
import type { Store } from './storeInterface'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { Category, ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'
import { NewIncome } from '@/types/income/income'

let store: Store
const newExpensesRef = ref<NewExpense[]>([])
const newIncomesRef = ref<NewIncome[]>([])

export async function createStore() {
  const storeObj = reactive<Omit<Store, 'newExpenses' | 'newIncomes'>>({
    getAccountDetails: async () => {
      const session = await authClient.getSession()

      if (!session || !session?.data?.user) {
        throw new Error('User not authenticated')
      }
      return {
        userId: session.data.user.id,
        // @ts-ignore -- This is defined in the custom session callback in the backend
        accountId: session.data.user.accountId,
      }
    },
    categories: [],
    deleteCategory: (categoryId: string) => {
      store.categories = store.categories.filter((category) => category.id !== categoryId)
    },
    addCategory: (newCategory: ExpenseCategory) => {
      store.categories.push(newCategory)
      store.categories = store.categories.sort((a, b) => a.name.localeCompare(b.name))
    },
    updateCategory: (updatedCategory: ExpenseCategory) => {
      const categoryIndex = store.categories.findIndex((cat) => cat.id === updatedCategory.id)
      if (categoryIndex !== -1) {
        store.categories[categoryIndex] = updatedCategory
        store.categories = store.categories.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
    addSubCategory: (categoryId: string, newSubCategory: ExpenseSubCategory) => {
      const category = store.categories.find((cat) => cat.id === categoryId)
      if (category) {
        category.subCategories.push(newSubCategory)
        category.subCategories = category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
    updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => {
      const category = store.categories.find((cat) => cat.id === categoryId)
      if (category) {
        const subCategoryIndex = category.subCategories.findIndex(
          (subCat) => subCat.id === updatedSubCategory.id,
        )
        if (subCategoryIndex !== -1) {
          category.subCategories[subCategoryIndex] = updatedSubCategory
          category.subCategories = category.subCategories.sort((a, b) =>
            a.name.localeCompare(b.name),
          )
        }
      }
    },
    addNewExpense: (expense: NewExpense) => {
      if (newExpensesRef.value.length === 1) {
        const [onlyExpenseRow] = newExpensesRef.value
        if (!onlyExpenseRow.name && !onlyExpenseRow.netAmount) {
          // Assume this is the first empty row and overwrite it
          newExpensesRef.value = [expense]
          return
        }
      }
      newExpensesRef.value.push(expense)
    },
    addNewIncome: (income: NewIncome) => {
      newIncomesRef.value.push(income)
    },
    clearNewExpenses: () => {
      newExpensesRef.value = []
    },
    clearNewIncomes: () => {
      newIncomesRef.value = []
    },
  })

  store = {
    ...storeObj,
    newExpenses: newExpensesRef,
    newIncomes: newIncomesRef,
  } as Store
  try {
    store.categories = await fetchCategories()
  } catch (error) {
    console.error('Error fetching categories during store initialization:', error)
  }
}

export function getStore(): Store {
  return store
}

async function fetchCategories() {
  const fetchedCategories = await getCategories()
  return fetchedCategories
}
