export interface DataSummary {
  total: number
  threeMonthAvg: number
  diffTotalToAvg: number
  diffTotalToAvgAsPercent: number | undefined
}

export interface ExpenseSummaryListItem {
  id: string
  name: string
  date: string
  netAmount: number
}

export interface MonthDataSummary {
  expenses: DataSummary
  income: DataSummary
  savings: number
}

export interface ExpenseSubCategorySummary extends DataSummary {
  id: string
  name: string
  expenses: ExpenseSummaryListItem[]
}

export interface ExpenseCategorySummary extends DataSummary {
  id: string
  name: string
  subCategories: ExpenseSubCategorySummary[]
  uncategorizedExpenses: ExpenseSummaryListItem[]
}

export type ExpenseSummaryByCategory = ExpenseCategorySummary[]
