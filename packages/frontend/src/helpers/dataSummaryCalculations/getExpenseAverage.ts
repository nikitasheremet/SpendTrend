import { Expense } from '@/types/expenseData'
import { sub } from 'date-fns/sub'
import { getTotalAmountForMonth } from './getTotalAmountForMonth'

export function getExpenseAverage(
  expenses: Expense[],
  fromMonth: number,
  fromYear: number,
  numberOfMonths: number,
): number {
  if (numberOfMonths <= 0) return 0

  const fromDate = new Date(fromYear, fromMonth, 15)

  const formattedData = expenses.map((expense) => ({
    date: expense.date as string,
    amount: expense.netAmount,
  }))

  let sumOfTotals = 0
  let monthsWithData = 0
  for (let i = 1; i <= numberOfMonths; i++) {
    const dateToTotalFor = sub(fromDate, { months: i })
    const totalForMonth = getTotalAmountForMonth(
      formattedData,
      dateToTotalFor.getMonth(),
      dateToTotalFor.getFullYear(),
    )
    sumOfTotals += totalForMonth

    if (totalForMonth > 0) {
      monthsWithData += 1
    }
  }

  if (monthsWithData === 0) return 0

  const average = Math.round((sumOfTotals / monthsWithData) * 100) / 100

  return average
}
