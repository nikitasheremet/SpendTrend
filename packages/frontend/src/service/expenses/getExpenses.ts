import type { Expense } from '@/types/expenseData'
import { getExpensesGateway } from '@/gateway/expense/getExpenses'
import { getStore } from '@/store/store'

export async function getExpenses(): Promise<Expense[]> {
  const { userId, accountId } = await getStore().getAccountDetails()
  console.log('Getting expenses for userId:', userId, 'accountId:', accountId)
  return await getExpensesGateway({ userId, accountId })
}
