export function subtractMonthsFromDate(date, monthsToSubtract) {
    const newDate = new Date(date);
    const monthToSubtractFrom = newDate.getMonth();
    newDate.setMonth(monthToSubtractFrom - monthsToSubtract);
    return newDate;
}
