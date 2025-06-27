import type { Expense } from '@/types/expenseData'
import { updateExpense as repoUpdateExpense } from '@/repository/expenses/updateExpense'

export async function updateExpense(updatedExpense: Expense): Promise<Expense> {
  return await repoUpdateExpense(updatedExpense)
}
