import { ExpenseSubCategory } from '@/types/expenseData'
import { updateExpenseSubCategory } from '@/gateway/expenseSubCategory/updateExpenseSubCategory'
import { getStore } from '@/store/store'

export async function updateSubCategory(id: string, name: string): Promise<ExpenseSubCategory> {
  const { userId, accountId } = await getStore().getAccountDetails()
  return await updateExpenseSubCategory({ subCategoryId: id, userId, accountId, name })
}
