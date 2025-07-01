import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '@/types/expenseSummary';
import type { ExpenseSummaryCalculatorI } from './interaface';
export declare class ExpenseSummaryCalculator implements ExpenseSummaryCalculatorI {
    private selectedMonth;
    private selectedYear;
    private selectedMonthAsDate;
    constructor(selectedMonth: number, selectedYear: number);
    getExpenseSummaryForSelectedMonth(): Promise<ExpenseSummaryForMonth>;
    getExpenseSummaryByCategory(): Promise<ExpenseSummaryByCategory>;
    private compileExpenseSummaryForSelectedMonth;
    private compileExpenseSummaryByCategory;
    private compileExpenseSummaryBySubcategory;
    private compileExpenseSummary;
    private getExpensesForSelectedMonth;
    private totalForSelectedMonth;
    private threeMonthAverageForSelectedMonth;
    private diffTotalToAverage;
    private diffTotalToAverageAsPercent;
    private categoryTotalForSelectedMonth;
    private categoryThreeMonthAverage;
    private categoryDiffTotalToAverage;
    private categoryDiffTotalToAverageAsPercent;
}
