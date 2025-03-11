export type ExpenseSummaryForMonth = {
  totalAmount: number
  threeMonthAverage: number
  diffTotalToAverage: number
  diffTotalToAverageAsPercent: number
}

export type ExpenseSummaryByCategory = {
  [category: string]: {
    totalAmount: number
    threeMonthAverage: number
    diffTotalToAverage: number
    diffTotalToAverageAsPercent: number
  }
}
