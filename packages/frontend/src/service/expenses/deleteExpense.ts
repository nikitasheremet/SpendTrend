import { deleteExpense as gatewayDeleteExpense } from '@/gateway/expense/deleteExpense'
import { getStore } from '@/store/store'
import type { Expense } from '@/types/expenseData'

export async function deleteExpense(expenseId: string): Promise<Expense> {
  const { userId, accountId } = getStore().getAccountDetails()
  return await gatewayDeleteExpense(expenseId, userId, accountId)
}
