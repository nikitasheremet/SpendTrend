import { getTotalAmountForMonth } from './getTotalAmountForMonth.js'
import { Income } from '@/types/income/income.js'

export function getTotalIncomesForSelectedMonth(
  incomes: Income[],
  selectedMonth: number,
  selectedYear: number,
): number {
  const formattedData = incomes.map((income) => ({
    date: income.date as string,
    amount: income.amount,
  }))
  const totalForMonth = getTotalAmountForMonth(formattedData, selectedMonth, selectedYear)
  return totalForMonth
}
