import { GetExpenseCategoriesInput } from '../validation/models'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { getExpenseCategoriesRepository } from '../repository/getExpenseCategoriesRepository'

export async function getExpenseCategoriesService(
  input: GetExpenseCategoriesInput,
): Promise<ExpenseCategory[]> {
  const queriedExpenseCategories = await getExpenseCategoriesRepository(input)
  return queriedExpenseCategories
}
