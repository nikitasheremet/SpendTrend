import { deleteExpense as repoDeleteExpense } from '@/repository/expenses/deleteExpense'
export async function deleteExpense(expenseId: string): Promise<string> {
  return await repoDeleteExpense(expenseId)
}
