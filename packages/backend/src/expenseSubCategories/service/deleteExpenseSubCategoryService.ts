import { DeleteExpenseSubCategoryInput } from '../validation/models'
import {
  deleteExpenseSubCategoryRepository,
  deleteExpenseSubCategoryReferencesInExpenses,
} from '../repository'
import { ExpenseSubCategoryDbRow } from '../../models/expenseSubCategory/expenseSubCategory'

export async function deleteExpenseSubCategoryService(
  input: DeleteExpenseSubCategoryInput,
): Promise<ExpenseSubCategoryDbRow> {
  // First clean up references in expenses table
  await deleteExpenseSubCategoryReferencesInExpenses(input.subCategoryId)

  // Then delete the expense subcategory after all references are removed
  const deletedSubCategory = await deleteExpenseSubCategoryRepository(input)

  return deletedSubCategory
}
