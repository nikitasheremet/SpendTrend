import { isSameMonth } from 'date-fns/isSameMonth'

interface DataToTotal {
  date: string
  amount: number
}

export function getTotalAmountForMonth(
  data: DataToTotal[],
  selectedMonth: number,
  selectedYear: number,
): number {
  const selectedMonthYearDate = new Date(selectedYear, selectedMonth, 15)
  return data.reduce((total, item) => {
    const itemDate = new Date(item.date)
    if (isSameMonth(selectedMonthYearDate, itemDate)) {
      return (total = total + item.amount)
    }
    return total
  }, 0)
}
