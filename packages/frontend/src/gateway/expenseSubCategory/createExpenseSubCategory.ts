import { ExpenseSubCategory } from '@/types/expenseData'
import { CreateExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/createExpenseSubCategory'
import { post } from '@gateway/post'
import { createExpenseSubCategoryResponseToDomainExpenseSubCategory } from '../mappers/expenseSubCategory/createExpenseSubCategoryResponseToDomainExpenseSubCategory'

export interface CreateExpenseSubCategoryRequest {
  userId: string
  accountId: string
  categoryId: string
  name: string
}

export async function createExpenseSubCategory(
  request: CreateExpenseSubCategoryRequest,
): Promise<ExpenseSubCategory> {
  const response = await post<CreateExpenseSubCategoryResponse>('createexpensesubcategory', request)
  return createExpenseSubCategoryResponseToDomainExpenseSubCategory(response.expenseSubCategory)
}
