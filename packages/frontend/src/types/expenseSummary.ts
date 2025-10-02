export interface ExpenseDetails {
  totalAmount: number
  threeMonthAverage: number
  diffTotalToAverage: number
  diffTotalToAverageAsPercent: number
}

export interface IncomeDetails {
  totalIncome: number
  incomeThreeMonthAverage: number
  incomeDiffTotalToAverage: number
  incomeDiffTotalToAverageAsPercent: number
  savings: number
}

export interface MonthDetails extends ExpenseDetails, IncomeDetails {}

export type ExpenseSummaryForMonth = MonthDetails

export type ExpenseSummaryBySubcategory = {
  [subcategory: string]: ExpenseDetails
}

export type CategorySummary = ExpenseDetails & {
  subcategories: ExpenseSummaryBySubcategory
}

export type ExpenseSummaryByCategory = {
  [category: string]: CategorySummary
}
