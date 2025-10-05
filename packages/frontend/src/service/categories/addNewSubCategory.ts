import { createExpenseSubCategory } from '@/gateway/expenseSubCategory/createExpenseSubCategory'
import { getStore } from '@/store/store'
import type { ExpenseSubCategory } from '@/types/expenseData'

export async function addNewSubcategory(
  categoryId: string,
  subCategoryName: string,
): Promise<ExpenseSubCategory> {
  const { userId, accountId } = await getStore().getAccountDetails()
  try {
    const request = {
      userId,
      accountId,
      categoryId,
      name: subCategoryName,
    }
    return await createExpenseSubCategory(request)
  } catch (error) {
    console.error('Failed to create expense subcategory', subCategoryName, error)
    throw error
  }
}
