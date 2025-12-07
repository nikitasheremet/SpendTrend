import { ExpenseCategory } from '@/types/expenseData'
import { UpdateExpenseCategoryResponse } from '@contracts/expenseCategory/updateExpenseCategory'
import { put } from '@gateway/put'
import { updateExpenseCategoryResponseToDomainExpenseCategory } from '../mappers/expenseCategory/updateExpenseCategoryResponseToDomainExpenseCategory'

export interface UpdateExpenseCategoryRequest {
  id: string
  userId: string
  accountId: string
  name: string
}

export async function updateExpenseCategory(
  request: UpdateExpenseCategoryRequest,
): Promise<ExpenseCategory> {
  try {
    const response = await put<UpdateExpenseCategoryResponse>('updateexpensecategory', request)
    return updateExpenseCategoryResponseToDomainExpenseCategory(response.expenseCategory)
  } catch (error) {
    console.error('Error updating expense category:', error)
    throw error
  }
}
