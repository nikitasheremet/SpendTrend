import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import {
  createExpenseSubcategoryRepository,
  CreateExpenseSubcategory,
} from '../repository/createExpenseSubcategoryRepository'
import { CreateExpenseSubcategoryInput } from '../validation/models'

export async function createExpenseSubcategoryService(
  input: CreateExpenseSubcategoryInput,
): Promise<ExpenseSubCategory> {
  const createExpenseSubcategoryInputs: CreateExpenseSubcategory = {
    ...input,
  }
  return createExpenseSubcategoryRepository(createExpenseSubcategoryInputs)
}
