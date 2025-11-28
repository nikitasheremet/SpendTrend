interface DataToTotal {
  date: string
  amount: number
}

function isSameMonthCustom(dateStr: string, year: number, month: number): boolean {
  const [expenseYear, expenseMonth] = dateStr.split('-')
  return parseInt(expenseYear) === year && parseInt(expenseMonth) === month + 1 // month is 0-based
}

export function getTotalAmountForMonth(
  data: DataToTotal[],
  selectedMonth: number,
  selectedYear: number,
): number {
  return data.reduce((total, item) => {
    if (isSameMonthCustom(item.date, selectedYear, selectedMonth)) {
      return total + item.amount
    }
    return total
  }, 0)
}
