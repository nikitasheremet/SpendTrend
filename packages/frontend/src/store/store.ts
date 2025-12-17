import { reactive, ref, watch } from 'vue'
import type { Store } from './storeInterface'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'
import { NewIncome } from '@/types/income/income'

const STORAGE_KEY_EXPENSES = 'spendtrend_new_expenses'
const STORAGE_KEY_INCOMES = 'spendtrend_new_incomes'

let store: Store
const newExpensesRef = ref<NewExpense[]>([])
const newIncomesRef = ref<NewIncome[]>([])
const selectedMonthRef = ref<number>(new Date().getUTCMonth())
const selectedYearRef = ref<number>(new Date().getUTCFullYear())

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  [() => newExpensesRef.value, () => newIncomesRef.value],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      saveExpensesToStorage()
    }, 500)
  },
  { deep: true },
)

const storeObj = reactive<
  Omit<Store, 'newExpenses' | 'newIncomes' | 'selectedMonth' | 'selectedYear'>
>({
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
        category.subCategories = category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
      }
    }
  },
  addNewExpense: (expense: NewExpense) => {
    if (newExpensesRef.value.length === 1) {
      const [onlyExpenseRow] = newExpensesRef.value
      if (!onlyExpenseRow.name && !onlyExpenseRow.netAmount) {
        // Assume this is the first empty row and overwrite it
        newExpensesRef.value = [expense]
        saveExpensesToStorage()
        return
      }
    }
    newExpensesRef.value.push(expense)
    saveExpensesToStorage()
  },
  addNewIncome: (income: NewIncome) => {
    newIncomesRef.value.push(income)
    saveIncomesToStorage()
  },
  clearNewExpenses: () => {
    newExpensesRef.value = []
    saveExpensesToStorage()
  },
  clearNewIncomes: () => {
    newIncomesRef.value = []
    saveIncomesToStorage()
  },
})

export async function createStore() {
  console.log('selectedMonth:', selectedMonthRef.value, 'selectedYear:', selectedYearRef.value)
  store = {
    ...storeObj,
    newExpenses: newExpensesRef,
    newIncomes: newIncomesRef,
    selectedMonth: selectedMonthRef,
    selectedYear: selectedYearRef,
  } as Store
  try {
    store.categories = await fetchCategories()
    // Load expenses and incomes from localStorage
    newExpensesRef.value = loadExpensesFromStorage()
    newIncomesRef.value = loadIncomesFromStorage()
  } catch (error) {
    console.error('Error during store initialization:', error)
  }
}

export function getStore(): Store {
  return store
}

async function fetchCategories() {
  const fetchedCategories = await getCategories()
  return fetchedCategories
}

function saveExpensesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(newExpensesRef.value))
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error)
  }
}

function saveIncomesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_INCOMES, JSON.stringify(newIncomesRef.value))
  } catch (error) {
    console.error('Error saving incomes to localStorage:', error)
  }
}

function loadExpensesFromStorage(): NewExpense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPENSES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading expenses from localStorage:', error)
    return []
  }
}

function loadIncomesFromStorage(): NewIncome[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_INCOMES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading incomes from localStorage:', error)
    return []
  }
}
