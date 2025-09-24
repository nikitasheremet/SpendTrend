import { ExpenseCategory } from '@/types/expenseData'
import { GetExpenseCategoriesResponse } from '@contracts/expenseCategory/getExpenseCategories'
import { get } from '@gateway/get'
import { getExpenseCategoriesResponseToDomainExpenseCategories } from '../mappers/expenseCategory/getExpenseCategoriesResponseToDomainExpenseCategories'

export interface GetExpenseCategoriesRequest {
  userId: string
  accountId: string
}

export async function getExpenseCategories(
  request: GetExpenseCategoriesRequest,
): Promise<ExpenseCategory[]> {
  const response = await get<GetExpenseCategoriesResponse>('getexpensecategories', {
    userId: request.userId,
    accountId: request.accountId,
  })
  return getExpenseCategoriesResponseToDomainExpenseCategories(response)
}
