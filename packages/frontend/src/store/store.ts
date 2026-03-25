import { reactive, ref, watch } from 'vue'
import type { NewExpense } from '@/types/expenseData'
import type { NewIncome } from '@/types/income/income'
import type { Store } from './storeInterface'
import { createStoreExpenses } from './storeExpenses'
import { createStoreIncomes } from './storeIncomes'
import { createStoreCategories } from './storeCategories'
import { createStoreDrafts } from './storeDrafts'
import { createStoreSummaryPeriod } from './storeSummaryPeriod'
import { createStoreExpenseDuplicates } from './storeExpenseDuplicates'
import { createStoreIncomeDuplicates } from './storeIncomeDuplicates'
import { getAccountDetails } from './storeAccount'
import { fetchInitialStoreData } from './storeInitialization'
import {
  loadExpensesFromStorage,
  loadIncomesFromStorage,
  saveExpensesToStorage,
  saveIncomesToStorage,
} from './storeDraftPersistence'
import { areDraftRowsEqual, cloneDraftRows } from './storeDuplicateUtils'

interface DraftChangeAnalysis {
  changedIndexes: number[]
  isSingleRowAddOrUpdate: boolean
  isSingleRowDelete: boolean
}

const ZERO_CHANGED_ROWS = 0
const SINGLE_CHANGED_ROW = 1
const INDEX_OFFSET = 1
const DUPLICATE_PRESENCE_THRESHOLD = 0

let store: Store
const expensesDomain = createStoreExpenses()
const incomesDomain = createStoreIncomes()
const categoriesDomain = createStoreCategories(expensesDomain.expenses)
const draftsDomain = createStoreDrafts()
const summaryPeriodDomain = createStoreSummaryPeriod(expensesDomain.expenses)
const expenseDuplicatesDomain = createStoreExpenseDuplicates()
const incomeDuplicatesDomain = createStoreIncomeDuplicates()
const isExpenseDuplicatesPresentRef = ref(false)
const isIncomeDuplicatesPresentRef = ref(false)

const previousDraftExpensesRef = ref<NewExpense[]>([])
const previousDraftIncomesRef = ref<NewIncome[]>([])

function analyzeDraftChanges<T>(previousRows: T[], currentRows: T[]): DraftChangeAnalysis {
  const changedIndexes: number[] = []
  const maxRowCount = Math.max(previousRows.length, currentRows.length)

  for (let index = 0; index < maxRowCount; index += INDEX_OFFSET) {
    if (!areDraftRowsEqual(previousRows[index], currentRows[index])) {
      changedIndexes.push(index)
    }
  }

  const isSingleRowDelete =
    currentRows.length < previousRows.length && changedIndexes.length === SINGLE_CHANGED_ROW
  const isSingleRowAddOrUpdate =
    currentRows.length >= previousRows.length && changedIndexes.length === SINGLE_CHANGED_ROW

  return {
    changedIndexes,
    isSingleRowAddOrUpdate,
    isSingleRowDelete,
  }
}

function updateDuplicatesPresenceFlag() {
  const expenseDuplicateCount = expenseDuplicatesDomain.expenseDuplicates.value.length
  const incomeDuplicateCount = incomeDuplicatesDomain.incomeDuplicates.value.length

  isExpenseDuplicatesPresentRef.value = expenseDuplicateCount > DUPLICATE_PRESENCE_THRESHOLD
  isIncomeDuplicatesPresentRef.value = incomeDuplicateCount > DUPLICATE_PRESENCE_THRESHOLD
}

watch(
  [() => draftsDomain.newExpenses.value, () => draftsDomain.newIncomes.value],
  () => {
    saveExpensesToStorage(draftsDomain.newExpenses.value)
    saveIncomesToStorage(draftsDomain.newIncomes.value)
  },
  { deep: true },
)

watch(
  () => draftsDomain.newExpenses.value,
  (currentDraftExpenses) => {
    const { changedIndexes, isSingleRowAddOrUpdate, isSingleRowDelete } = analyzeDraftChanges(
      previousDraftExpensesRef.value,
      currentDraftExpenses,
    )

    if (changedIndexes.length === ZERO_CHANGED_ROWS) {
      return
    }

    if (isSingleRowAddOrUpdate) {
      expenseDuplicatesDomain.recheckDraftExpenseRow(changedIndexes[0], currentDraftExpenses)
    } else if (isSingleRowDelete) {
      expenseDuplicatesDomain.rebuildExpenseDuplicates(currentDraftExpenses)
    } else {
      expenseDuplicatesDomain.rebuildExpenseDuplicates(currentDraftExpenses)
    }

    previousDraftExpensesRef.value = cloneDraftRows(currentDraftExpenses)
    updateDuplicatesPresenceFlag()
  },
  { deep: true },
)

watch(
  () => draftsDomain.newIncomes.value,
  (currentDraftIncomes) => {
    const { changedIndexes, isSingleRowAddOrUpdate, isSingleRowDelete } = analyzeDraftChanges(
      previousDraftIncomesRef.value,
      currentDraftIncomes,
    )

    if (changedIndexes.length === ZERO_CHANGED_ROWS) {
      return
    }

    if (isSingleRowAddOrUpdate) {
      incomeDuplicatesDomain.recheckDraftIncomeRow(changedIndexes[0], currentDraftIncomes)
    } else if (isSingleRowDelete) {
      incomeDuplicatesDomain.rebuildIncomeDuplicates(currentDraftIncomes)
    } else {
      incomeDuplicatesDomain.rebuildIncomeDuplicates(currentDraftIncomes)
    }

    previousDraftIncomesRef.value = cloneDraftRows(currentDraftIncomes)
    updateDuplicatesPresenceFlag()
  },
  { deep: true },
)

watch(
  () => expensesDomain.expenses.value,
  (currentExpenses) => {
    expenseDuplicatesDomain.syncExistingExpenses(currentExpenses)
    expenseDuplicatesDomain.rebuildExpenseDuplicates(draftsDomain.newExpenses.value)
    previousDraftExpensesRef.value = cloneDraftRows(draftsDomain.newExpenses.value)
    updateDuplicatesPresenceFlag()
  },
)

watch(
  () => incomesDomain.incomes.value,
  (currentIncomes) => {
    incomeDuplicatesDomain.syncExistingIncomes(currentIncomes)
    incomeDuplicatesDomain.rebuildIncomeDuplicates(draftsDomain.newIncomes.value)
    previousDraftIncomesRef.value = cloneDraftRows(draftsDomain.newIncomes.value)
    updateDuplicatesPresenceFlag()
  },
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
    | 'expenseDuplicates'
    | 'incomeDuplicates'
    | 'isExpenseDuplicatesPresent'
    | 'isIncomeDuplicatesPresent'
  >
>({
  getAccountDetails,
  deleteCategory: categoriesDomain.deleteCategory,
  addCategory: categoriesDomain.addCategory,
  updateCategory: categoriesDomain.updateCategory,
  addSubCategory: categoriesDomain.addSubCategory,
  updateSubCategory: categoriesDomain.updateSubCategory,
  setExpenses: expensesDomain.setExpenses,
  addExpenses: expensesDomain.addExpenses,
  updateExpense: expensesDomain.updateExpense,
  deleteExpense: expensesDomain.deleteExpense,
  setIncomes: incomesDomain.setIncomes,
  addIncomes: incomesDomain.addIncomes,
  updateIncome: incomesDomain.updateIncome,
  deleteIncome: incomesDomain.deleteIncome,
  addNewExpense: draftsDomain.addNewExpense,
  addNewIncome: draftsDomain.addNewIncome,
  clearNewExpenses: draftsDomain.clearNewExpenses,
  clearNewIncomes: draftsDomain.clearNewIncomes,
  markSummaryPeriodAsManuallySelected: summaryPeriodDomain.markSummaryPeriodAsManuallySelected,
  applyLatestExpenseSummaryPeriodDefault:
    summaryPeriodDomain.applyLatestExpenseSummaryPeriodDefault,
})

export async function createStore() {
  summaryPeriodDomain.resetSummaryPeriodManualSelection()

  store = {
    ...storeObj,
    categories: categoriesDomain.categories,
    expenses: expensesDomain.expenses,
    incomes: incomesDomain.incomes,
    newExpenses: draftsDomain.newExpenses,
    newIncomes: draftsDomain.newIncomes,
    expenseDuplicates: expenseDuplicatesDomain.expenseDuplicates,
    incomeDuplicates: incomeDuplicatesDomain.incomeDuplicates,
    isExpenseDuplicatesPresent: isExpenseDuplicatesPresentRef,
    isIncomeDuplicatesPresent: isIncomeDuplicatesPresentRef,
    selectedMonth: summaryPeriodDomain.selectedMonth,
    selectedYear: summaryPeriodDomain.selectedYear,
  } as Store
  try {
    const initialData = await fetchInitialStoreData()
    categoriesDomain.categories.value = initialData.categories
    expensesDomain.expenses.value = initialData.expenses
    incomesDomain.incomes.value = initialData.incomes

    // Load expenses and incomes from localStorage
    draftsDomain.newExpenses.value = loadExpensesFromStorage()
    draftsDomain.newIncomes.value = loadIncomesFromStorage()

    expenseDuplicatesDomain.syncExistingExpenses(expensesDomain.expenses.value)
    incomeDuplicatesDomain.syncExistingIncomes(incomesDomain.incomes.value)
    expenseDuplicatesDomain.rebuildExpenseDuplicates(draftsDomain.newExpenses.value)
    incomeDuplicatesDomain.rebuildIncomeDuplicates(draftsDomain.newIncomes.value)

    previousDraftExpensesRef.value = cloneDraftRows(draftsDomain.newExpenses.value)
    previousDraftIncomesRef.value = cloneDraftRows(draftsDomain.newIncomes.value)
    updateDuplicatesPresenceFlag()

    console.log('Store created', store)
  } catch (error) {
    console.error('Error during store initialization:', error)
  }
}

export function getStore(): Store {
  return store
}
