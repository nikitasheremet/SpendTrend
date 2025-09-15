import { db } from '../../db'
import { expensesTable, expenseSubCategoriesTable } from '../../db/schema'
import { ExpenseSubCategoryDbRow } from '../../models/expenseSubCategory/expenseSubCategory'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { eq, and } from 'drizzle-orm'

export interface DeleteExpenseSubCategoryRepositoryInput {
  accountId: string
  subCategoryId: string
  userId: string
}

export async function deleteExpenseSubCategoryRepository(
  input: DeleteExpenseSubCategoryRepositoryInput,
): Promise<ExpenseSubCategoryDbRow> {
  try {
    const { accountId, subCategoryId } = input

    const [deletedSubCategory] = await db
      .delete(expenseSubCategoriesTable)
      .where(
        and(
          eq(expenseSubCategoriesTable.id, subCategoryId),
          eq(expenseSubCategoriesTable.accountId, accountId),
        ),
      )
      .returning()

    if (!deletedSubCategory) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR}: Could not find subCategory with id: ${subCategoryId} for account: ${accountId}`,
      )
    }

    return deletedSubCategory
  } catch (error) {
    console.error(
      `ExpenseSubCategories: deleteExpenseSubCategoryRepository: Failed to delete expense subcategory with id: ${input.subCategoryId}`,
      error,
    )

    if (error instanceof RepositoryError) {
      throw error
    }

    const dbError = error as Error
    throw new RepositoryError(
      `${DB_ERROR}: Failed to delete expense subcategory. Error: ${dbError.message}`,
    )
  }
}

export async function deleteExpenseSubCategoryReferencesInExpenses(
  subCategoryId: string,
): Promise<number> {
  try {
    const result = await db
      .update(expensesTable)
      .set({
        subCategoryId: null,
        updatedAt: new Date(),
      })
      .where(eq(expensesTable.subCategoryId, subCategoryId))

    return result.rowCount || 0
  } catch (error) {
    console.error(
      `ExpenseSubCategories: deleteExpenseSubCategoryReferencesInExpenses: Failed to update expenses referencing subcategory: ${subCategoryId}`,
      error,
    )

    const dbError = error as Error
    throw new RepositoryError(
      `${DB_ERROR}: Failed to update expenses that reference deleted subcategory. Error: ${dbError.message}`,
    )
  }
}
