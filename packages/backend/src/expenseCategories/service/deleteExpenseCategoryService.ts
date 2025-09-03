import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { deleteExpenseCategoryRepository } from '../repository/deleteExpenseCategoryRepository'
import { DeleteExpenseCategoryInput } from '../validation/models'

export async function deleteExpenseCategoryService(
  input: DeleteExpenseCategoryInput,
): Promise<ExpenseCategory> {
  const deletedExpenseCategory = await deleteExpenseCategoryRepository(input.id)
  return deletedExpenseCategory
}