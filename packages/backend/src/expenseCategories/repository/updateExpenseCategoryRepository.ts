import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export interface UpdateExpenseCategoryRepoInput {
  id: string
  updates: {
    name?: string
    subcategories?: string[]
  }
}

export async function updateExpenseCategoryRepository(
  input: UpdateExpenseCategoryRepoInput,
): Promise<ExpenseCategory> {
  try {
    const [updatedExpenseCategory] = await db
      .update(expenseCategoriesTable)
      .set(input.updates)
      .where(eq(expenseCategoriesTable.id, input.id))
      .returning()

    if (!updatedExpenseCategory) {
      throw new RepositoryError(NOT_FOUND_ERROR)
    }

    return dbExpenseCategoryToDomain(updatedExpenseCategory)
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
