import type { ExpenseSummaryByCategory, ExpenseSummaryForMonth } from '../../types/dataSummary.js'

export interface ExpenseSummaryCalculatorI {
  getExpenseSummaryForSelectedMonth: () => Promise<ExpenseSummaryForMonth>
  getExpenseSummaryByCategory: () => Promise<ExpenseSummaryByCategory>
}
