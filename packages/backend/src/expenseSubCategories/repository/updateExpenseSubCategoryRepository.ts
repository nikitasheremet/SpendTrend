import { db } from '../../db'
import { expenseSubCategoriesTable } from '../../db/schema'
import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import { dbExpenseSubCategoryToDomain } from '../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { eq } from 'drizzle-orm'

export interface UpdateExpenseSubcategory {
  name: string
}

export async function updateExpenseSubCategoryRepository(
  subCategoryId: string,
  patch: UpdateExpenseSubcategory,
): Promise<ExpenseSubCategory> {
  try {
    const [updatedSubcategory] = await db
      .update(expenseSubCategoriesTable)
      .set({
        name: patch.name,
        updatedAt: new Date(),
      })
      .where(eq(expenseSubCategoriesTable.id, subCategoryId))
      .returning()

    if (!updatedSubcategory) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR}: Could not find subCategory with id: ${subCategoryId}`,
      )
    }

    return dbExpenseSubCategoryToDomain(updatedSubcategory)
  } catch (error) {
    console.error(
      `ExpenseSubCategories: updateExpenseSubcategoryRepository: Failed to update expense subcategory with id: ${subCategoryId}`,
      error,
    )

    if (error instanceof RepositoryError) {
      throw error
    }

    const dbError = error as Error
    throw new RepositoryError(
      `${DB_ERROR}: Failed to update expense subcategory. Error: ${dbError.message}`,
    )
  }
}
