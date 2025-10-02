import { ExpenseSummaryCalculator } from '@/helpers/expenseSummaryCalculator'
import { ref, toValue, watchEffect, type Ref } from 'vue'
import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '@/types/expenseSummary'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getTotalExpensesForSelectedMonth } from '../../../helpers/dataSummaryCalculations/getTotalExpensesForSelectedMonth.js'
import { getExpenseAverage } from '@/helpers/dataSummaryCalculations/getExpenseAverage.js'
import { getAllIncomes } from '@/service/income/getAllIncomes.js'
import { getTotalIncomesForSelectedMonth } from '@/helpers/dataSummaryCalculations/getTotalIncomeForSelectedMonth.js'
import { getIncomeAverage } from '@/helpers/dataSummaryCalculations/getIncomeAverage.js'
import { getCategories } from '@/service/categories/getCategories.js'
import { Expense, ExpenseSubCategory } from '@/types/expenseData.js'

const EMPTY_SUMMARY_FOR_SELECTED_MONTH: ExpenseSummaryForMonth = {
  totalAmount: 0,
  threeMonthAverage: 0,
  diffTotalToAverage: 0,
  diffTotalToAverageAsPercent: 0,
  totalIncome: 0,
  incomeThreeMonthAverage: 0,
  incomeDiffTotalToAverage: 0,
  incomeDiffTotalToAverageAsPercent: 0,
  savings: 0,
}

export function useGetMonthlyExpenseSummary(
  selectedMonth: Ref<number, number>,
  selectedYear: Ref<number, number>,
) {
  const summaryForSelectedMonth = ref<ExpenseSummaryForMonth>(EMPTY_SUMMARY_FOR_SELECTED_MONTH)
  const summaryForSelectedMonthByCategory = ref<ExpenseSummaryByCategory>({})
  const summaryByCategory = ref<{
    [key: string]: {
      subCategories: ExpenseSubCategory[]
      expenses: Expense[]
      totalAmount: number
      threeMonthAverage: number
      diffTotalToAverage: number
      diffTotalToAverageAsPercent: number
    }
  }>({})

  async function calculateSummaryValues(selectedMonth: number, selectedYear: number) {
    const allExpenses = await getExpenses()
    summaryForSelectedMonth.value.totalAmount = getTotalExpensesForSelectedMonth(
      allExpenses,
      selectedMonth,
      selectedYear,
    )
    summaryForSelectedMonth.value.threeMonthAverage = getExpenseAverage(
      allExpenses,
      selectedMonth,
      selectedYear,
      3,
    )
    summaryForSelectedMonth.value.diffTotalToAverage =
      summaryForSelectedMonth.value.totalAmount - summaryForSelectedMonth.value.threeMonthAverage
    summaryForSelectedMonth.value.diffTotalToAverageAsPercent =
      summaryForSelectedMonth.value?.threeMonthAverage &&
      Math.round(
        (summaryForSelectedMonth.value.diffTotalToAverage /
          summaryForSelectedMonth.value.threeMonthAverage) *
          100,
      )
    const allIncomes = await getAllIncomes()
    summaryForSelectedMonth.value.totalIncome = getTotalIncomesForSelectedMonth(
      allIncomes,
      selectedMonth,
      selectedYear,
    )
    summaryForSelectedMonth.value.incomeThreeMonthAverage = getIncomeAverage(
      allIncomes,
      selectedMonth,
      selectedYear,
      3,
    )
    summaryForSelectedMonth.value.incomeDiffTotalToAverage =
      summaryForSelectedMonth.value.totalIncome -
      summaryForSelectedMonth.value.incomeThreeMonthAverage
    summaryForSelectedMonth.value.incomeDiffTotalToAverageAsPercent =
      summaryForSelectedMonth.value?.incomeThreeMonthAverage &&
      Math.round(
        (summaryForSelectedMonth.value.incomeDiffTotalToAverage /
          summaryForSelectedMonth.value.incomeThreeMonthAverage) *
          100,
      )
    summaryForSelectedMonth.value.savings =
      summaryForSelectedMonth.value.totalIncome - summaryForSelectedMonth.value.totalAmount

    const allCategories = await getCategories()
    const categoryByExpense: {
      [key: string]: {
        subCategories: ExpenseSubCategory[]
        expenses: Expense[]
        totalAmount: number
        threeMonthAverage: number
        diffTotalToAverage: number
        diffTotalToAverageAsPercent: number
      }
    } = {}

    for (const category of allCategories) {
      categoryByExpense[category.name] = {
        subCategories: category.subCategories,
        expenses: [],
        totalAmount: 0,
        threeMonthAverage: 0,
        diffTotalToAverage: 0,
        diffTotalToAverageAsPercent: 0,
      }
      categoryByExpense[category.name].expenses = allExpenses.filter(
        (expense) => expense.category.id === category.id,
      )
      categoryByExpense[category.name].totalAmount = getTotalExpensesForSelectedMonth(
        categoryByExpense[category.name].expenses,
        selectedMonth,
        selectedYear,
      )
      categoryByExpense[category.name].threeMonthAverage = getExpenseAverage(
        categoryByExpense[category.name].expenses,
        selectedMonth,
        selectedYear,
        3,
      )
      categoryByExpense[category.name].diffTotalToAverage =
        categoryByExpense[category.name].totalAmount -
        categoryByExpense[category.name].threeMonthAverage
      categoryByExpense[category.name].diffTotalToAverageAsPercent =
        categoryByExpense[category.name]?.threeMonthAverage &&
        Math.round(
          (categoryByExpense[category.name].diffTotalToAverage /
            categoryByExpense[category.name].threeMonthAverage) *
            100,
        )
    }
    console.log('categoryByExpense', categoryByExpense)
    summaryByCategory.value = categoryByExpense
  }

  watchEffect(() => {
    calculateSummaryValues(toValue(selectedMonth), toValue(selectedYear))
  })

  return {
    summaryForSelectedMonth,
    summaryForSelectedMonthByCategory,
    summaryByCategory,
  }
}
