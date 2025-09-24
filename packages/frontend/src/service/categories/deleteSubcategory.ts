import { ExpenseSubCategory } from '@/types/expenseData'
import { deleteExpenseSubCategory } from '@/gateway/expenseSubCategory/deleteExpenseSubCategory'
import { getStore } from '@/store/store'

export async function deleteSubCategory(id: string): Promise<ExpenseSubCategory> {
  const { userId, accountId } = getStore().getAccountDetails()
  return await deleteExpenseSubCategory({ userId, accountId, subCategoryId: id })
}
