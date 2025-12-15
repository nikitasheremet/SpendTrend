import type { Expense } from '@/types/expenseData'
import { getExpensesGateway } from '@/gateway/expense/getExpenses'
import { getStore } from '@/store/store'

export async function getExpenses(): Promise<Expense[]> {
  const { userId, accountId } = await getStore().getAccountDetails()
  return await getExpensesGateway({ userId, accountId })
}
