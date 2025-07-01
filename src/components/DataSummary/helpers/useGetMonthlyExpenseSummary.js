import { ExpenseSummaryCalculator } from '@/helpers/expenseSummaryCalculator';
import { ref, toValue, watchEffect } from 'vue';
const EMPTY_SUMMARY_FOR_SELECTED_MONTH = {
    totalAmount: 0,
    threeMonthAverage: 0,
    diffTotalToAverage: 0,
    diffTotalToAverageAsPercent: 0,
};
export function useGetMonthlyExpenseSummary(selectedMonth, selectedYear) {
    const summaryForSelectedMonth = ref(EMPTY_SUMMARY_FOR_SELECTED_MONTH);
    const summaryForSelectedMonthByCategory = ref({});
    async function calculateSummaryValues(selectedMonth, selectedYear) {
        const summaryCalculator = new ExpenseSummaryCalculator(selectedMonth, selectedYear);
        summaryCalculator
            .getExpenseSummaryForSelectedMonth()
            .then((result) => (summaryForSelectedMonth.value = result));
        summaryCalculator
            .getExpenseSummaryByCategory()
            .then((result) => (summaryForSelectedMonthByCategory.value = result));
    }
    watchEffect(() => {
        calculateSummaryValues(toValue(selectedMonth), toValue(selectedYear));
    });
    return {
        summaryForSelectedMonth,
        summaryForSelectedMonthByCategory,
    };
}
