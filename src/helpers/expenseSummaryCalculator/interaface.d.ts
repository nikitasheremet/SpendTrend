import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '@/types/expenseSummary';
export interface ExpenseSummaryCalculatorI {
    getExpenseSummaryForSelectedMonth: () => Promise<ExpenseSummaryForMonth>;
    getExpenseSummaryByCategory: () => Promise<ExpenseSummaryByCategory>;
}
