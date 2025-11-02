import { Expense } from '@/types/expenseData'
import { getTotalAmountForMonth } from './getTotalAmountForMonth'

export function getTotalExpensesForSelectedMonth(
  expenses: Expense[],
  selectedMonth: number,
  selectedYear: number,
): number {
  const formattedData = expenses.map((expense) => ({
    date: expense.date as string,
    amount: expense.amount,
  }))
  const totalForMonth = getTotalAmountForMonth(formattedData, selectedMonth, selectedYear)
  return Math.round(totalForMonth * 100) / 100
}
