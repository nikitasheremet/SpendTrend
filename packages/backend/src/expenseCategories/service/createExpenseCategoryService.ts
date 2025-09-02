import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { createExpenseCategoryRepository } from '../repository/createExpenseCategoryRepository'
import { CreateExpenseCategoryInput } from '../validation/models'

export async function createExpenseCategoryService(
  input: CreateExpenseCategoryInput,
): Promise<ExpenseCategory> {
  const repoInput = {
    userId: input.userId,
    accountId: input.accountId,
    name: input.name,
    subcategories: input.subcategories,
  }

  const createdExpenseCategory = await createExpenseCategoryRepository(repoInput)
  return createdExpenseCategory
}
