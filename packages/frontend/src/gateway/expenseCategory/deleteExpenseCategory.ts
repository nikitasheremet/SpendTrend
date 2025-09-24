import { ExpenseCategory } from '@/types/expenseData'
import { DeleteExpenseCategoryResponse } from '@contracts/expenseCategory/deleteExpenseCategory'
import { post } from '@gateway/post'
import { deleteExpenseCategoryResponseToDomainExpenseCategory } from '../mappers/expenseCategory/deleteExpenseCategoryResponseToDomainExpenseCategory'

export interface DeleteExpenseCategoryRequest {
  userId: string
  accountId: string
  id: string
}

export async function deleteExpenseCategory(
  request: DeleteExpenseCategoryRequest,
): Promise<ExpenseCategory> {
  try {
    const response = await post<DeleteExpenseCategoryResponse>('deleteexpensecategory', request)
    return deleteExpenseCategoryResponseToDomainExpenseCategory(response.expenseCategory)
  } catch (error) {
    console.error('Error deleting expense category:', error)
    throw error
  }
}
