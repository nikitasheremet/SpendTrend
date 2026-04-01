import { ref, toValue, watchEffect, type Ref } from 'vue'
import type {
  ExpenseCategorySummary,
  ExpenseSummaryListItem,
  ExpenseSubCategorySummary,
  ExpenseSummaryByCategory,
  MonthDataSummary,
} from '../../../types/dataSummary.js'
import { getTotalExpensesForSelectedMonth } from '../../../helpers/dataSummaryCalculations/getTotalExpensesForSelectedMonth.js'
import { getExpenseAverage } from '@/helpers/dataSummaryCalculations/getExpenseAverage.js'
import { getTotalIncomesForSelectedMonth } from '@/helpers/dataSummaryCalculations/getTotalIncomeForSelectedMonth.js'
import { getIncomeAverage } from '@/helpers/dataSummaryCalculations/getIncomeAverage.js'
import { Expense } from '@/types/expenseData.js'
import { Income } from '@/types/income/income.js'
import { getStore } from '@/store/store'

const THREE_MONTH_AVERAGE_WINDOW = 3
const ROUNDING_FACTOR = 100
const MIN_POSITIVE_NET_AMOUNT = 0
export const UNCATEGORIZED_CATEGORY_ID = '__uncategorized__'
export const UNCATEGORIZED_CATEGORY_NAME = 'Uncategorized'

const EMPTY_SUMMARY_FOR_SELECTED_MONTH: MonthDataSummary = {
  expenses: {
    total: 0,
    threeMonthAvg: 0,
    diffTotalToAvg: 0,
    diffTotalToAvgAsPercent: 0,
  },
  income: {
    total: 0,
    threeMonthAvg: 0,
    diffTotalToAvg: 0,
    diffTotalToAvgAsPercent: 0,
  },
  savings: 0,
}

export function useGetMonthlyExpenseSummary(
  selectedMonth: Ref<number, number>,
  selectedYear: Ref<number, number>,
) {
  const store = getStore()
  const summaryForSelectedMonth = ref<MonthDataSummary>(EMPTY_SUMMARY_FOR_SELECTED_MONTH)
  const summaryForSelectedMonthByCategory = ref<ExpenseSummaryByCategory>([])

  function calculateSummaryValues(selectedMonth: number, selectedYear: number) {
    const allExpenses = store.expenses.value
    const expenseSummary = new ExpenseSummary(allExpenses, selectedMonth, selectedYear)
    summaryForSelectedMonth.value.expenses = {
      total: expenseSummary.totalAmount,
      threeMonthAvg: expenseSummary.threeMonthAverage,
      diffTotalToAvg: expenseSummary.diffTotalToAverage,
      diffTotalToAvgAsPercent: expenseSummary.diffTotalToAverageAsPercent,
    }

    const allIncomes = store.incomes.value
    const incomeSummary = new IncomeSummary(allIncomes, selectedMonth, selectedYear)

    summaryForSelectedMonth.value.income = {
      total: incomeSummary.totalAmount,
      threeMonthAvg: incomeSummary.threeMonthAverage,
      diffTotalToAvg: incomeSummary.diffTotalToAverage,
      diffTotalToAvgAsPercent: incomeSummary.diffTotalToAverageAsPercent,
    }

    summaryForSelectedMonth.value.savings = incomeSummary.totalAmount - expenseSummary.totalAmount

    const allCategories = store.categories.value

    const categoriesSummary: ExpenseSummaryByCategory = []

    for (const category of allCategories) {
      const categoryExpenses = allExpenses.filter((expense) => expense.category?.id === category.id)
      const categorySummary = buildCategorySummary(category.id, category.name, categoryExpenses, {
        selectedMonth,
        selectedYear,
      })

      categoriesSummary.push(categorySummary)

      for (const subCategory of category.subCategories) {
        const subCategorySummary: ExpenseSubCategorySummary = {
          id: subCategory.id,
          name: subCategory.name,
          expenses: [],
          total: 0,
          threeMonthAvg: 0,
          diffTotalToAvg: 0,
          diffTotalToAvgAsPercent: 0,
        }

        const subCategoryExpenses = categoryExpenses.filter(
          (expense) => expense.subCategory?.id === subCategory.id,
        )

        subCategorySummary.total = getTotalExpensesForSelectedMonth(
          subCategoryExpenses,
          selectedMonth,
          selectedYear,
        )
        subCategorySummary.threeMonthAvg = getExpenseAverage(
          subCategoryExpenses,
          selectedMonth,
          selectedYear,
          THREE_MONTH_AVERAGE_WINDOW,
        )
        subCategorySummary.diffTotalToAvg = roundToTwoDecimals(
          subCategorySummary.total - subCategorySummary.threeMonthAvg,
        )
        subCategorySummary.diffTotalToAvgAsPercent =
          subCategorySummary.threeMonthAvg === 0
            ? undefined
            : Math.round(
                (subCategorySummary.diffTotalToAvg / subCategorySummary.threeMonthAvg) *
                  ROUNDING_FACTOR,
              )
        subCategorySummary.expenses = buildSortedPositiveExpensesForMonth(
          subCategoryExpenses,
          selectedMonth,
          selectedYear,
        )

        categorySummary.subCategories.push(subCategorySummary)
      }
    }

    const uncategorizedCategoryExpenses = allExpenses.filter((expense) => !expense.category)
    const uncategorizedCategorySummary = buildCategorySummary(
      UNCATEGORIZED_CATEGORY_ID,
      UNCATEGORIZED_CATEGORY_NAME,
      uncategorizedCategoryExpenses,
      {
        selectedMonth,
        selectedYear,
      },
    )

    categoriesSummary.push(uncategorizedCategorySummary)

    summaryForSelectedMonthByCategory.value = categoriesSummary
  }

  watchEffect(() => {
    calculateSummaryValues(toValue(selectedMonth), toValue(selectedYear))
  })

  return {
    summaryForSelectedMonth,
    summaryForSelectedMonthByCategory,
  }
}

class ExpenseSummary {
  totalAmount = 0
  threeMonthAverage = 0
  diffTotalToAverage = 0
  diffTotalToAverageAsPercent: number | undefined = undefined

  constructor(allExpenses: Expense[], selectedMonth: number, selectedYear: number) {
    const totalAmount = getTotalExpensesForSelectedMonth(allExpenses, selectedMonth, selectedYear)
    this.totalAmount = totalAmount
    const threeMonthAverage = getExpenseAverage(
      allExpenses,
      selectedMonth,
      selectedYear,
      THREE_MONTH_AVERAGE_WINDOW,
    )
    this.threeMonthAverage = threeMonthAverage
    this.diffTotalToAverage = roundToTwoDecimals(totalAmount - threeMonthAverage)
    this.diffTotalToAverageAsPercent =
      threeMonthAverage === 0
        ? undefined
        : Math.round((this.diffTotalToAverage / threeMonthAverage) * ROUNDING_FACTOR)
  }
}

class IncomeSummary {
  totalAmount = 0
  threeMonthAverage = 0
  diffTotalToAverage = 0
  diffTotalToAverageAsPercent: number | undefined = undefined

  constructor(allIncomes: Income[], selectedMonth: number, selectedYear: number) {
    const totalAmount = getTotalIncomesForSelectedMonth(allIncomes, selectedMonth, selectedYear)
    this.totalAmount = totalAmount
    const threeMonthAverage = getIncomeAverage(
      allIncomes,
      selectedMonth,
      selectedYear,
      THREE_MONTH_AVERAGE_WINDOW,
    )
    this.threeMonthAverage = threeMonthAverage
    this.diffTotalToAverage = roundToTwoDecimals(totalAmount - threeMonthAverage)
    this.diffTotalToAverageAsPercent =
      threeMonthAverage === 0
        ? undefined
        : Math.round((this.diffTotalToAverage / threeMonthAverage) * ROUNDING_FACTOR)
  }
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * ROUNDING_FACTOR) / ROUNDING_FACTOR
}

function buildCategorySummary(
  id: string,
  name: string,
  expenses: Expense[],
  params: {
    selectedMonth: number
    selectedYear: number
  },
): ExpenseCategorySummary {
  const total = getTotalExpensesForSelectedMonth(
    expenses,
    params.selectedMonth,
    params.selectedYear,
  )
  const threeMonthAvg = getExpenseAverage(
    expenses,
    params.selectedMonth,
    params.selectedYear,
    THREE_MONTH_AVERAGE_WINDOW,
  )
  const diffTotalToAvg = roundToTwoDecimals(total - threeMonthAvg)

  return {
    id,
    name,
    subCategories: [],
    uncategorizedExpenses: buildSortedPositiveExpensesForMonth(
      expenses.filter((expense) => !expense.subCategory),
      params.selectedMonth,
      params.selectedYear,
    ),
    total,
    threeMonthAvg,
    diffTotalToAvg,
    diffTotalToAvgAsPercent:
      threeMonthAvg === 0
        ? undefined
        : Math.round((diffTotalToAvg / threeMonthAvg) * ROUNDING_FACTOR),
  }
}

function isExpenseWithinSelectedMonth(
  expense: Expense,
  selectedMonth: number,
  selectedYear: number,
) {
  const expenseDate = new Date(expense.date)
  return (
    expenseDate.getUTCMonth() === selectedMonth && expenseDate.getUTCFullYear() === selectedYear
  )
}

function sortExpenseRowsByContribution(leftExpense: Expense, rightExpense: Expense): number {
  if (rightExpense.netAmount !== leftExpense.netAmount) {
    return rightExpense.netAmount - leftExpense.netAmount
  }

  const leftTimestamp = Date.parse(leftExpense.date)
  const rightTimestamp = Date.parse(rightExpense.date)

  return rightTimestamp - leftTimestamp
}

function mapExpenseToSummaryListItem(expense: Expense): ExpenseSummaryListItem {
  return {
    id: expense.id,
    name: expense.name,
    date: expense.date,
    netAmount: expense.netAmount,
  }
}

export function buildSortedPositiveExpensesForMonth(
  expenses: Expense[],
  selectedMonth: number,
  selectedYear: number,
): ExpenseSummaryListItem[] {
  return expenses
    .filter((expense) => isExpenseWithinSelectedMonth(expense, selectedMonth, selectedYear))
    .filter((expense) => expense.netAmount > MIN_POSITIVE_NET_AMOUNT)
    .sort(sortExpenseRowsByContribution)
    .map(mapExpenseToSummaryListItem)
}
