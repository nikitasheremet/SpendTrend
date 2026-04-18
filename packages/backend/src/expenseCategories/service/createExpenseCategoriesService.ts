import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import {
  CreateExpenseCategoriesRepoInput,
  createExpenseCategoriesRepository,
} from '../repository/createExpenseCategoriesRepository'

export async function createExpenseCategoriesService(
  input: CreateExpenseCategoriesRepoInput,
): Promise<ExpenseCategory[]> {
  const repoInput = {
    userId: input.userId,
    accountId: input.accountId,
    name: input.name,
  }

  const createdExpenseCategories = await createExpenseCategoriesRepository(repoInput)
  return createdExpenseCategories
}
