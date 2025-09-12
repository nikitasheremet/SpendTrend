import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import { updateExpenseSubCategoryRepository } from '../repository/updateExpenseSubCategoryRepository'
import { UpdateExpenseSubCategoryInput } from '../validation/models'

export async function updateExpenseSubCategoryService(
  input: UpdateExpenseSubCategoryInput,
): Promise<ExpenseSubCategory> {
  const updatePatch = {
    name: input.name,
  }

  return updateExpenseSubCategoryRepository(input.subCategoryId, updatePatch)
}
