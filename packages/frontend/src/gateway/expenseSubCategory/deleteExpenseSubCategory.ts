import { ExpenseSubCategory } from '@/types/expenseData'
import { DeleteExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/deleteExpenseSubCategory'
import { post } from '@gateway/post'
import { deleteExpenseSubCategoryResponseToDomainExpenseSubCategory } from '../mappers/expenseSubCategory/deleteExpenseSubCategoryResponseToDomainExpenseSubCategory'

export interface DeleteExpenseSubCategoryRequest {
  userId: string
  accountId: string
  subCategoryId: string
}

export async function deleteExpenseSubCategory(
  request: DeleteExpenseSubCategoryRequest,
): Promise<ExpenseSubCategory> {
  const response = await post<DeleteExpenseSubCategoryResponse>('deleteexpensesubcategory', request)
  console.log('Delete response:', response)
  return deleteExpenseSubCategoryResponseToDomainExpenseSubCategory(
    response.deletedExpenseSubCategory,
  )
}
