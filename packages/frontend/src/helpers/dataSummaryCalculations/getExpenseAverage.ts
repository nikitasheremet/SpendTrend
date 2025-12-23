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

  const totalsPerMonth = []
  for (let i = 1; i < numberOfMonths; i++) {
    const dateToTotalFor = sub(fromDate, { months: i })
    const totalForMonth = getTotalAmountForMonth(
      formattedData,
      dateToTotalFor.getMonth(),
      dateToTotalFor.getFullYear(),
    )
    totalsPerMonth.push(totalForMonth)
  }

  const sumOfTotals = totalsPerMonth.reduce((acc, curr) => acc + curr, 0)
  const average = Math.round((sumOfTotals / numberOfMonths) * 100) / 100

  return average
}
