import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export async function deleteExpenseCategoryRepository(id: string): Promise<ExpenseCategory> {
  try {
    const [deletedRow] = await db
      .delete(expenseCategoriesTable)
      .where(eq(expenseCategoriesTable.id, id))
      .returning()

    if (!deletedRow) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR} - No expense category found to delete with id: ${id}`,
      )
    }

    return dbExpenseCategoryToDomain(deletedRow)
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
