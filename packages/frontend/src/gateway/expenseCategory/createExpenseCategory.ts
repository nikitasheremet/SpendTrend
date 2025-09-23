import { ExpenseCategory } from '@/types/expenseData'
import { CreateExpenseCategoryResponse } from '@contracts/expenseCategory/createExpenseCategory'
import { post } from '@gateway/post'
import { createExpenseCategoryResponseToDomainExpenseCategory } from '../mappers/expenseCategory/createExpenseCategoryResponseToDomainExpenseCategory'

export interface CreateExpenseCategoryRequest {
  userId: string
  accountId: string
  name: string
}

export async function createExpenseCategory(
  request: CreateExpenseCategoryRequest,
): Promise<ExpenseCategory> {
  const response = await post<CreateExpenseCategoryResponse>('createexpensecategory', request)
  return createExpenseCategoryResponseToDomainExpenseCategory(response.expenseCategory)
}
