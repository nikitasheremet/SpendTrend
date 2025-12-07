import { ExpenseSubCategory } from '@/types/expenseData'
import { UpdateExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/updateExpenseSubCategory'
import { put } from '@gateway/put'
import { updateExpenseSubCategoryResponseToDomainExpenseSubCategory } from '../mappers/expenseSubCategory/updateExpenseSubCategoryResponseToDomainExpenseSubCategory'

export interface UpdateExpenseSubCategoryRequest {
  subCategoryId: string
  userId: string
  accountId: string
  name: string
}

export async function updateExpenseSubCategory(
  request: UpdateExpenseSubCategoryRequest,
): Promise<ExpenseSubCategory> {
  try {
    const response = await put<UpdateExpenseSubCategoryResponse>(
      'updateexpensesubcategory',
      request,
    )
    return updateExpenseSubCategoryResponseToDomainExpenseSubCategory(
      response.updatedExpenseSubCategory,
    )
  } catch (error) {
    console.error('Error updating expense subcategory:', error)
    throw error
  }
}
