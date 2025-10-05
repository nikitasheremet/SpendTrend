import { ExpenseCategory } from '@/types/expenseData'
import { deleteExpenseCategory } from '@/gateway/expenseCategory/deleteExpenseCategory'
import { getStore } from '@/store/store'

export async function deleteCategory(id: string): Promise<ExpenseCategory> {
  const { userId, accountId } = await getStore().getAccountDetails()
  return await deleteExpenseCategory({ userId, accountId, id })
}
