import { reactive, ref, watch } from 'vue'
import type { Store } from './storeInterface'
import { authClient } from '@/lib/auth-client'
import { getCategories } from '@/service/categories/getCategories'
import { Expense, ExpenseCategory, ExpenseSubCategory, NewExpense } from '@/types/expenseData'
import { Income, NewIncome } from '@/types/income/income'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getAllIncomes } from '@/service/income/getAllIncomes'

const STORAGE_KEY_EXPENSES = 'spendtrend_new_expenses'
const STORAGE_KEY_INCOMES = 'spendtrend_new_incomes'

let store: Store
const newExpensesRef = ref<NewExpense[]>([])
const newIncomesRef = ref<NewIncome[]>([])
const selectedMonthRef = ref<number>(new Date().getUTCMonth())
const selectedYearRef = ref<number>(new Date().getUTCFullYear())
const isSummaryPeriodManuallySelectedRef = ref<boolean>(false)
const expenseCategories = ref<ExpenseCategory[]>([])
const expensesRef = ref<Expense[]>([])
const incomesRef = ref<Income[]>([])

watch(
  [() => newExpensesRef.value, () => newIncomesRef.value],
  () => {
    saveExpensesToStorage()
    saveIncomesToStorage()
  },
  { deep: true },
)

const storeObj = reactive<
  Omit<
    Store,
    | 'newExpenses'
    | 'newIncomes'
    | 'selectedMonth'
    | 'selectedYear'
    | 'categories'
    | 'expenses'
    | 'incomes'
  >
>({
  markSummaryPeriodAsManuallySelected: () => {
    isSummaryPeriodManuallySelectedRef.value = true
  },
  applyLatestExpenseSummaryPeriodDefault: () => {
    if (isSummaryPeriodManuallySelectedRef.value) {
      return
    }

    const latestExpenseSummaryPeriod = getLatestExpenseSummaryPeriod(expensesRef.value)

    if (!latestExpenseSummaryPeriod) {
      selectedMonthRef.value = new Date().getUTCMonth()
      selectedYearRef.value = new Date().getUTCFullYear()
      return
    }

    selectedMonthRef.value = latestExpenseSummaryPeriod.month
    selectedYearRef.value = latestExpenseSummaryPeriod.year
  },
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
  deleteCategory: (categoryId: string) => {
    expenseCategories.value = expenseCategories.value.filter(
      (category) => category.id !== categoryId,
    )
  },
  addCategory: (newCategory: ExpenseCategory) => {
    expenseCategories.value = [...expenseCategories.value, newCategory].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  },
  updateCategory: (updatedCategory: ExpenseCategory) => {
    const categoryIndex = expenseCategories.value.findIndex((cat) => cat.id === updatedCategory.id)
    if (categoryIndex === -1) return

    const updatedCategories = [...expenseCategories.value]
    updatedCategories[categoryIndex] = updatedCategory
    expenseCategories.value = updatedCategories.sort((a, b) => a.name.localeCompare(b.name))

    expensesRef.value = expensesRef.value.map((expense) => {
      if (expense.category.id !== updatedCategory.id) {
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
  },
  addSubCategory: (categoryId: string, newSubCategory: ExpenseSubCategory) => {
    const category = expenseCategories.value.find((cat) => cat.id === categoryId)
    if (category) {
      category.subCategories.push(newSubCategory)
      category.subCategories = category.subCategories.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  updateSubCategory: (categoryId: string, updatedSubCategory: ExpenseSubCategory) => {
    const category = expenseCategories.value.find((cat) => cat.id === categoryId)
    if (!category) return

    const subCategoryIndex = category.subCategories.findIndex(
      (subCat) => subCat.id === updatedSubCategory.id,
    )
    if (subCategoryIndex === -1) return

    const updatedSubCategories = [...category.subCategories]
    updatedSubCategories[subCategoryIndex] = updatedSubCategory
    category.subCategories = updatedSubCategories.sort((a, b) => a.name.localeCompare(b.name))

    expensesRef.value = expensesRef.value.map((expense) => {
      if (expense.category.id !== categoryId || expense.subCategory?.id !== updatedSubCategory.id) {
        return expense
      }

      return {
        ...expense,
        subCategory: updatedSubCategory,
      }
    })
  },
  setExpenses: (newExpenses: Expense[]) => {
    expensesRef.value = newExpenses
  },
  addExpenses: (newExpenses: Expense[]) => {
    expensesRef.value = [...newExpenses, ...expensesRef.value]
  },
  updateExpense: (updatedExpense: Expense) => {
    const expenseIndex = expensesRef.value.findIndex((expense) => expense.id === updatedExpense.id)
    if (expenseIndex === -1) return

    const updatedExpenses = [...expensesRef.value]
    updatedExpenses[expenseIndex] = updatedExpense
    expensesRef.value = updatedExpenses
  },
  deleteExpense: (expenseId: string) => {
    expensesRef.value = expensesRef.value.filter((expense) => expense.id !== expenseId)
  },
  setIncomes: (newIncomes: Income[]) => {
    incomesRef.value = newIncomes
  },
  addIncomes: (newIncomes: Income[]) => {
    incomesRef.value = [...newIncomes, ...incomesRef.value]
  },
  updateIncome: (updatedIncome: Income) => {
    const incomeIndex = incomesRef.value.findIndex((income) => income.id === updatedIncome.id)
    if (incomeIndex === -1) return

    const updatedIncomes = [...incomesRef.value]
    updatedIncomes[incomeIndex] = updatedIncome
    incomesRef.value = updatedIncomes
  },
  deleteIncome: (incomeId: string) => {
    incomesRef.value = incomesRef.value.filter((income) => income.id !== incomeId)
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
    if (newIncomesRef.value.length === 1) {
      const [onlyIncomeRow] = newIncomesRef.value
      if (!onlyIncomeRow.name && !onlyIncomeRow.amount) {
        // Assume this is the first empty row and overwrite it
        newIncomesRef.value = [income]
        saveIncomesToStorage()
        return
      }
    }
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
  isSummaryPeriodManuallySelectedRef.value = false

  store = {
    ...storeObj,
    categories: expenseCategories,
    expenses: expensesRef,
    incomes: incomesRef,
    newExpenses: newExpensesRef,
    newIncomes: newIncomesRef,
    selectedMonth: selectedMonthRef,
    selectedYear: selectedYearRef,
  } as Store
  try {
    await fetchInitialData()
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

async function fetchExpenses() {
  const fetchedExpenses = await getExpenses()
  return fetchedExpenses
}

async function fetchIncomes() {
  const fetchedIncomes = await getAllIncomes()
  return fetchedIncomes
}

async function fetchInitialData() {
  const [categories, expenses, incomes] = await Promise.all([
    fetchCategories(),
    fetchExpenses(),
    fetchIncomes(),
  ])

  store.categories.value = categories
  store.expenses.value = expenses
  store.incomes.value = incomes
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

function getLatestExpenseSummaryPeriod(expenses: Expense[]): {
  month: number
  year: number
} | null {
  let latest: { month: number; year: number } | null = null

  for (const expense of expenses) {
    const parsedSummaryPeriod = parseExpenseSummaryPeriod(expense.date)
    if (!parsedSummaryPeriod) {
      continue
    }

    if (
      !latest ||
      parsedSummaryPeriod.year > latest.year ||
      (parsedSummaryPeriod.year === latest.year && parsedSummaryPeriod.month > latest.month)
    ) {
      latest = parsedSummaryPeriod
    }
  }

  return latest
}

function parseExpenseSummaryPeriod(date: string): {
  month: number
  year: number
} | null {
  const [yearPart, monthPart] = date.split('-')

  const parsedYear = Number(yearPart)
  const parsedMonth = Number(monthPart)
  const MIN_MONTH = 1
  const MAX_MONTH = 12

  if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth)) {
    return null
  }

  if (parsedMonth < MIN_MONTH || parsedMonth > MAX_MONTH) {
    return null
  }

  return {
    month: parsedMonth - 1,
    year: parsedYear,
  }
}
