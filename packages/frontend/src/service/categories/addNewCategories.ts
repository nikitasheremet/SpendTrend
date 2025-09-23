import { createExpenseCategory } from '@/gateway/expenseCategory/createExpenseCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory, NewExpenseCategory } from '@/types/expenseData'

export async function addNewCategory(category: NewExpenseCategory): Promise<ExpenseCategory> {
  const { userId, accountId } = getStore().getAccountDetails()
  try {
    const request = {
      userId,
      accountId,
      name: category.name,
    }
    return await createExpenseCategory(request)
  } catch (error) {
    console.error('Failed to create expense category', category.name, error)
    throw error
  }
}
