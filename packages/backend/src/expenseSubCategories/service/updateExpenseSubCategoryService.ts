import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import { updateExpenseSubCategoryRepository } from '../repository/updateExpenseSubCategoryRepository'
import { UpdateExpenseSubcategoryInput } from '../validation/models'

export async function updateExpenseSubCategoryService(
  input: UpdateExpenseSubcategoryInput,
): Promise<ExpenseSubCategory> {
  const updatePatch = {
    name: input.name,
  }

  return updateExpenseSubCategoryRepository(input.subCategoryId, updatePatch)
}
