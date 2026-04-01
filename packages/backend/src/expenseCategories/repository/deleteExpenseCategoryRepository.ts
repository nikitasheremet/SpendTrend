import { eq, inArray, or } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable, expenseSubCategoriesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export async function deleteExpenseCategoryReferencesInExpenses(
  categoryId: string,
): Promise<number> {
  try {
    const categorySubCategories = await db
      .select({ id: expenseSubCategoriesTable.id })
      .from(expenseSubCategoriesTable)
      .where(eq(expenseSubCategoriesTable.categoryId, categoryId))

    const subCategoryIds = categorySubCategories.map((row) => row.id)

    const whereClause =
      subCategoryIds.length > 0
        ? or(
            eq(expensesTable.categoryId, categoryId),
            inArray(expensesTable.subCategoryId, subCategoryIds),
          )
        : eq(expensesTable.categoryId, categoryId)

    const result = await db
      .update(expensesTable)
      .set({
        categoryId: null,
        subCategoryId: null,
        updatedAt: new Date(),
      })
      .where(whereClause)

    return result.rowCount || 0
  } catch (error) {
    console.error(
      `ExpenseCategories: deleteExpenseCategoryReferencesInExpenses: Failed to update expenses referencing category: ${categoryId}`,
      error,
    )

    const dbError = error as Error
    throw new RepositoryError(
      `${DB_ERROR}: Failed to update expenses that reference deleted category. Error: ${dbError.message}`,
    )
  }
}

export async function deleteExpenseCategoryRepository(id: string): Promise<ExpenseCategory> {
  try {
    const categoryWithSubCategories = await db.query.expenseCategoriesTable.findFirst({
      where: eq(expenseCategoriesTable.id, id),
      with: {
        subCategories: true,
      },
    })

    console.log('Category with subcategories to delete:', categoryWithSubCategories)

    if (!categoryWithSubCategories) {
      throw new RepositoryError(`${NOT_FOUND_ERROR} - No expense category found with id: ${id}`)
    }

    await deleteExpenseCategoryReferencesInExpenses(id)

    // Delete the category (subcategories will be cascade deleted)
    await db.delete(expenseCategoriesTable).where(eq(expenseCategoriesTable.id, id))

    const mappedCategory = dbExpenseCategoryToDomain(categoryWithSubCategories)

    console.log('Mapped category to return after deletion:', mappedCategory)
    if (!mappedCategory) {
      throw new RepositoryError(`${NOT_FOUND_ERROR} - No expense category found with id: ${id}`)
    }
    return mappedCategory
  } catch (error) {
    console.error(error)
    if (error instanceof RepositoryError) {
      throw error
    }

    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
