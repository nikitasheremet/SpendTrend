import { getExpenseCategories } from '@/gateway/expenseCategory/getExpenseCategories'
import { getStore } from '@/store/store'
import type { ExpenseCategory } from '@/types/expenseData'

export async function getCategories(): Promise<ExpenseCategory[]> {
  const { userId, accountId } = await getStore().getAccountDetails()
  return await getExpenseCategories({ userId, accountId })
}
