import { ref, toValue, watchEffect, type Ref } from 'vue'
import type {
  ExpenseCategorySummary,
  ExpenseSubCategorySummary,
  ExpenseSummaryByCategory,
  MonthDataSummary,
} from '../../../types/dataSummary.js'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getTotalExpensesForSelectedMonth } from '../../../helpers/dataSummaryCalculations/getTotalExpensesForSelectedMonth.js'
import { getExpenseAverage } from '@/helpers/dataSummaryCalculations/getExpenseAverage.js'
import { getAllIncomes } from '@/service/income/getAllIncomes.js'
import { getTotalIncomesForSelectedMonth } from '@/helpers/dataSummaryCalculations/getTotalIncomeForSelectedMonth.js'
import { getIncomeAverage } from '@/helpers/dataSummaryCalculations/getIncomeAverage.js'
import { getCategories } from '@/service/categories/getCategories.js'
import { Expense } from '@/types/expenseData.js'
import { Income } from '@/types/income/income.js'

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
  const summaryForSelectedMonth = ref<MonthDataSummary>(EMPTY_SUMMARY_FOR_SELECTED_MONTH)
  const summaryForSelectedMonthByCategory = ref<ExpenseSummaryByCategory>([])

  async function calculateSummaryValues(selectedMonth: number, selectedYear: number) {
    const allExpenses = await getExpenses()
    const expenseSummary = new ExpenseSummary(allExpenses, selectedMonth, selectedYear)
    summaryForSelectedMonth.value.expenses = {
      total: expenseSummary.totalAmount,
      threeMonthAvg: expenseSummary.threeMonthAverage,
      diffTotalToAvg: expenseSummary.diffTotalToAverage,
      diffTotalToAvgAsPercent: expenseSummary.diffTotalToAverageAsPercent,
    }

    const allIncomes = await getAllIncomes()
    const incomeSummary = new IncomeSummary(allIncomes, selectedMonth, selectedYear)

    summaryForSelectedMonth.value.income = {
      total: incomeSummary.totalAmount,
      threeMonthAvg: incomeSummary.threeMonthAverage,
      diffTotalToAvg: incomeSummary.diffTotalToAverage,
      diffTotalToAvgAsPercent: incomeSummary.diffTotalToAverageAsPercent,
    }

    summaryForSelectedMonth.value.savings = incomeSummary.totalAmount - expenseSummary.totalAmount

    const allCategories = await getCategories()

    const categoriesSummary: ExpenseSummaryByCategory = []

    for (const category of allCategories) {
      const categorySummary: ExpenseCategorySummary = {
        name: category.name,
        subCategories: [],
        total: 0,
        threeMonthAvg: 0,
        diffTotalToAvg: 0,
        diffTotalToAvgAsPercent: 0,
      }
      const categoryExpenses = allExpenses.filter((expense) => expense.category.id === category.id)
      categorySummary.total = getTotalExpensesForSelectedMonth(
        categoryExpenses,
        selectedMonth,
        selectedYear,
      )
      categorySummary.threeMonthAvg = getExpenseAverage(
        categoryExpenses,
        selectedMonth,
        selectedYear,
        3,
      )
      categorySummary.diffTotalToAvg = categorySummary.total - categorySummary.threeMonthAvg
      categorySummary.diffTotalToAvgAsPercent =
        categorySummary.threeMonthAvg === 0
          ? undefined
          : Math.round((categorySummary.diffTotalToAvg / categorySummary.threeMonthAvg) * 100)

      categoriesSummary.push(categorySummary)

      // Neeed subcategory below after
      for (const subCategory of category.subCategories) {
        const subCategorySummary = {} as ExpenseSubCategorySummary
        subCategorySummary.name = subCategory.name
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
          3,
        )
        subCategorySummary.diffTotalToAvg =
          subCategorySummary.total - subCategorySummary.threeMonthAvg
        subCategorySummary.diffTotalToAvgAsPercent =
          subCategorySummary.threeMonthAvg === 0
            ? undefined
            : Math.round(
                (subCategorySummary.diffTotalToAvg / subCategorySummary.threeMonthAvg) * 100,
              )
        categorySummary.subCategories.push(subCategorySummary)
      }
    }
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
    const threeMonthAverage = getExpenseAverage(allExpenses, selectedMonth, selectedYear, 3)
    this.threeMonthAverage = threeMonthAverage
    this.diffTotalToAverage = totalAmount - threeMonthAverage
    this.diffTotalToAverageAsPercent =
      threeMonthAverage === 0
        ? undefined
        : Math.round((this.diffTotalToAverage / threeMonthAverage) * 100)
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
    const threeMonthAverage = getIncomeAverage(allIncomes, selectedMonth, selectedYear, 3)
    this.threeMonthAverage = threeMonthAverage
    this.diffTotalToAverage = totalAmount - threeMonthAverage
    this.diffTotalToAverageAsPercent =
      threeMonthAverage === 0
        ? undefined
        : Math.round((this.diffTotalToAverage / threeMonthAverage) * 100)
  }
}
