import { ExpenseCategory } from '@/types/expenseData'
import { GetExpenseCategoriesResponse } from '@contracts/expenseCategory/getExpenseCategories'
import { mapExpenseCategory } from './apiExpenseCategoryToDomain'

export function getExpenseCategoriesResponseToDomainExpenseCategories(
  response: GetExpenseCategoriesResponse,
): ExpenseCategory[] {
  return response.expenseCategories.map(mapExpenseCategory)
}
