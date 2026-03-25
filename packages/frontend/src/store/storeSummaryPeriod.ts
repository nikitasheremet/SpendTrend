import { ref, type Ref } from 'vue'
import type { Expense } from '@/types/expenseData'

const MIN_MONTH = 1
const MAX_MONTH = 12

export interface StoreSummaryPeriodDomain {
  selectedMonth: Ref<number>
  selectedYear: Ref<number>
  markSummaryPeriodAsManuallySelected: () => void
  applyLatestExpenseSummaryPeriodDefault: () => void
  resetSummaryPeriodManualSelection: () => void
}

export function createStoreSummaryPeriod(expensesRef: Ref<Expense[]>): StoreSummaryPeriodDomain {
  const selectedMonthRef = ref<number>(new Date().getUTCMonth())
  const selectedYearRef = ref<number>(new Date().getUTCFullYear())
  const isSummaryPeriodManuallySelectedRef = ref<boolean>(false)

  const markSummaryPeriodAsManuallySelected = () => {
    isSummaryPeriodManuallySelectedRef.value = true
  }

  const applyLatestExpenseSummaryPeriodDefault = () => {
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
  }

  const resetSummaryPeriodManualSelection = () => {
    isSummaryPeriodManuallySelectedRef.value = false
  }

  return {
    selectedMonth: selectedMonthRef,
    selectedYear: selectedYearRef,
    markSummaryPeriodAsManuallySelected,
    applyLatestExpenseSummaryPeriodDefault,
    resetSummaryPeriodManualSelection,
  }
}

export function getLatestExpenseSummaryPeriod(expenses: Expense[]): {
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

export function parseExpenseSummaryPeriod(date: string): {
  month: number
  year: number
} | null {
  const [yearPart, monthPart] = date.split('-')

  const parsedYear = Number(yearPart)
  const parsedMonth = Number(monthPart)

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
