export interface MonthDetails {
    totalAmount: number;
    threeMonthAverage: number;
    diffTotalToAverage: number;
    diffTotalToAverageAsPercent: number;
}
export type ExpenseSummaryForMonth = MonthDetails;
export type ExpenseSummaryBySubcategory = {
    [subcategory: string]: MonthDetails;
};
export type CategorySummary = MonthDetails & {
    subcategories: ExpenseSummaryBySubcategory;
};
export type ExpenseSummaryByCategory = {
    [category: string]: CategorySummary;
};
