import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export interface CreateExpenseCategoryRepoInput {
  userId: string
  accountId: string
  name: string
  subcategories: string[]
}

export async function createExpenseCategoryRepository(
  input: CreateExpenseCategoryRepoInput,
): Promise<ExpenseCategory> {
  try {
    const [createdExpenseCategory] = await db
      .insert(expenseCategoriesTable)
      .values(input)
      .returning()
    return dbExpenseCategoryToDomain(createdExpenseCategory)
  } catch (error) {
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
