export interface DataSummary {
  total: number
  threeMonthAvg: number
  diffTotalToAvg: number
  diffTotalToAvgAsPercent: number | undefined
}

export interface MonthDataSummary {
  expenses: DataSummary
  income: DataSummary
  savings: number
}

export interface ExpenseSubCategorySummary extends DataSummary {
  name: string
}

export interface ExpenseCategorySummary extends DataSummary {
  name: string
  subCategories: ExpenseSubCategorySummary[]
}

export type ExpenseSummaryByCategory = ExpenseCategorySummary[]
