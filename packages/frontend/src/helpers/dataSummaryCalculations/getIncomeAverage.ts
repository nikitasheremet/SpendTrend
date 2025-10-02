import { Expense } from '@/types/expenseData'
import { sub } from 'date-fns/sub'
import { getTotalAmountForMonth } from './getTotalAmountForMonth.js'
import { Income } from '@/types/income/income.js'

export function getIncomeAverage(
  incomes: Income[],
  fromMonth: number,
  fromYear: number,
  numberOfMonths: number,
): number {
  if (numberOfMonths <= 0) return 0

  const fromDate = new Date(fromYear, fromMonth, 15)

  const formattedData = incomes.map((income) => ({
    date: income.date as string,
    amount: income.amount,
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
