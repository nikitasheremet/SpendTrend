import { ExpenseSummaryCalculator } from '@/helpers/expenseSummaryCalculator'
import { ref, toValue, watchEffect, type Ref } from 'vue'
import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '@/types/expenseSummary'

const EMPTY_SUMMARY_FOR_SELECTED_MONTH: ExpenseSummaryForMonth = {
  totalAmount: 0,
  threeMonthAverage: 0,
  diffTotalToAverage: 0,
  diffTotalToAverageAsPercent: 0,
}

export function useGetMonthlyExpenseSummary(
  selectedMonth: Ref<number, number>,
  selectedYear: Ref<number, number>,
) {
  const summaryForSelectedMonth = ref<ExpenseSummaryForMonth>(EMPTY_SUMMARY_FOR_SELECTED_MONTH)
  const summaryForSelectedMonthByCategory = ref<ExpenseSummaryByCategory>({})

  async function calculateSummaryValues(selectedMonth: number, selectedYear: number) {
    const summaryCalculator = new ExpenseSummaryCalculator(selectedMonth, selectedYear)
    summaryCalculator
      .getExpenseSummaryForSelectedMonth()
      .then((result) => (summaryForSelectedMonth.value = result))
    summaryCalculator
      .getExpenseSummaryByCategory()
      .then((result) => (summaryForSelectedMonthByCategory.value = result))
  }

  watchEffect(() => {
    calculateSummaryValues(toValue(selectedMonth), toValue(selectedYear))
  })

  return {
    summaryForSelectedMonth,
    summaryForSelectedMonthByCategory,
  }
}
