import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { updateExpenseCategoryRepository } from '../repository/updateExpenseCategoryRepository'
import { UpdateExpenseCategoryInput } from '../validation/models'

export async function updateExpenseCategoryService(
  input: UpdateExpenseCategoryInput,
): Promise<ExpenseCategory> {
  const updateExpenseCategoryDetails = {
    id: input.id,
    updates: {
      name: input.name,
      subcategories: input.subcategories,
    },
  }

  const updatedExpenseCategory = await updateExpenseCategoryRepository(updateExpenseCategoryDetails)
  return updatedExpenseCategory
}
