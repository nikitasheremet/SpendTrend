import { ExpenseCategory } from '@/types/expenseData'
import { updateExpenseCategory } from '@/gateway/expenseCategory/updateExpenseCategory'
import { getStore } from '@/store/store'

export async function updateCategory(id: string, name: string): Promise<ExpenseCategory> {
  const { userId, accountId } = await getStore().getAccountDetails()
  return await updateExpenseCategory({ id, userId, accountId, name })
}
