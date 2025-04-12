import { getExpenses } from '@/repository/expenses/getExpenses'
import type { Expense } from '@/types/expenseData'

export async function getAllExpenses(): Promise<Expense[]> {
  return await getExpenses()
}
