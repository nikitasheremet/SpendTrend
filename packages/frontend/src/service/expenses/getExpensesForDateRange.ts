import { getExpenses } from '@/repository/expenses/getExpenses'
import type { Expense } from '@/types/expenseData'

export async function getExpensesForDateRange(
  dateRange: [number, number],
  filters?: {
    category?: string
    subcategory?: string
  },
  options?: {
    inclusive: boolean
  },
): Promise<Expense[]> {
  const savedExpenses = await getExpenses()
  const [startDate, endDate] = dateRange
  const inclusive = options?.inclusive ?? true

  if (inclusive) {
    return savedExpenses.filter((expense) => {
      const isWithinDateRange = expense.date >= startDate && expense.date <= endDate
      if (filters?.category && filters?.subcategory) {
        return (
          isWithinDateRange &&
          expense.subCategory === filters.subcategory &&
          expense.category === filters.category
        )
      }
      if (filters?.category) {
        return isWithinDateRange && expense.category === filters.category
      }
      return isWithinDateRange
    })
  }
  return savedExpenses.filter((expense) => expense.date > startDate && expense.date < endDate)
}
