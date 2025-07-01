import { type Ref } from 'vue';
import type { ExpenseSummaryByCategory } from '@/types/expenseSummary';
export declare function useGetMonthlyExpenseSummary(selectedMonth: Ref<number, number>, selectedYear: Ref<number, number>): {
    summaryForSelectedMonth: Ref<{
        totalAmount: number;
        threeMonthAverage: number;
        diffTotalToAverage: number;
        diffTotalToAverageAsPercent: number;
    }, import("@/types/expenseSummary").MonthDetails | {
        totalAmount: number;
        threeMonthAverage: number;
        diffTotalToAverage: number;
        diffTotalToAverageAsPercent: number;
    }>;
    summaryForSelectedMonthByCategory: Ref<ExpenseSummaryByCategory, ExpenseSummaryByCategory>;
};
