export function subtractMonthsFromDate(
  date: Date | number | string,
  monthsToSubtract: number,
): Date {
  const newDate = new Date(date)
  const monthToSubtractFrom = newDate.getMonth()
  newDate.setMonth(monthToSubtractFrom - monthsToSubtract)

  return newDate
}
