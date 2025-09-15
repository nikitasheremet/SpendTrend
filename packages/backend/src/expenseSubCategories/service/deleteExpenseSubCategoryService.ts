import { DeleteExpenseSubCategoryInput } from '../validation/models'
import {
  deleteExpenseSubCategoryRepository,
  deleteExpenseSubCategoryReferencesInExpenses,
} from '../repository'
import { ExpenseSubCategoryDbRow } from '../../models/expenseSubCategory/expenseSubCategory'

export async function deleteExpenseSubCategoryService(
  input: DeleteExpenseSubCategoryInput,
): Promise<ExpenseSubCategoryDbRow> {
  // First delete the expense subcategory
  const deletedSubCategory = await deleteExpenseSubCategoryRepository(input)

  // Then clean up references in expenses table
  await deleteExpenseSubCategoryReferencesInExpenses(input.subCategoryId)

  return deletedSubCategory
}
