import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import { createExpenseSubCategoryRepository, CreateExpenseSubCategory } from '../repository'
import { CreateExpenseSubCategoryInput } from '../validation/models'

export async function createExpenseSubCategoryService(
  input: CreateExpenseSubCategoryInput,
): Promise<ExpenseSubCategory> {
  const createExpenseSubCategoryInputs: CreateExpenseSubCategory = {
    ...input,
  }
  return createExpenseSubCategoryRepository(createExpenseSubCategoryInputs)
}
