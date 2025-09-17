import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export async function deleteExpenseCategoryRepository(id: string): Promise<ExpenseCategory> {
  try {
    const categoryWithSubCategories = await db.query.expenseCategoriesTable.findFirst({
      where: eq(expenseCategoriesTable.id, id),
      with: {
        subCategories: true,
      },
    })

    if (!categoryWithSubCategories) {
      throw new RepositoryError(`${NOT_FOUND_ERROR} - No expense category found with id: ${id}`)
    }

    // Delete the category (subcategories will be cascade deleted)
    await db.delete(expenseCategoriesTable).where(eq(expenseCategoriesTable.id, id))

    return dbExpenseCategoryToDomain(categoryWithSubCategories)
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
