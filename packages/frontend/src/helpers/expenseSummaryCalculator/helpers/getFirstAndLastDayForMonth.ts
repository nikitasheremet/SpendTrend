import type { ExpenseDate } from '@/types/expenseData'

export function getFirstAndLastDayForMonth(date: Date): [ExpenseDate, ExpenseDate] {
  const beginningDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 0).getTime()
  const endDate = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, -1).getTime()
  return [beginningDate, endDate]
}
