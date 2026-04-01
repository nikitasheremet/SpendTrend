import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Expense } from '../../models/expense/expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { DbExpenseCategoryWithSubCategories } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'
import { ExpenseSubCategoryDbRow } from '../../models/expenseSubCategory/expenseSubCategory'

export interface DeleteExpense {
  id: string
}

export async function deleteExpenseRepository(input: DeleteExpense): Promise<Expense> {
  try {
    // Find the expense to delete
    const [deletedExpense] = await db
      .delete(expensesTable)
      .where(eq(expensesTable.id, input.id))
      .returning()

    if (!deletedExpense) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR}: Expense not found for deletion. Expected ExpenseId: ${input.id}`,
      )
    }

    let expenseCategory: DbExpenseCategoryWithSubCategories | undefined
    let expenseSubCategory: ExpenseSubCategoryDbRow | undefined

    if (deletedExpense.categoryId) {
      // Get the category and subcategory for the expense
      expenseCategory = await db.query.expenseCategoriesTable.findFirst({
        where: eq(expenseCategoriesTable.id, deletedExpense.categoryId),
        with: { subCategories: true },
      })
      if (!expenseCategory)
        throw new RepositoryError(
          `${DB_ERROR}: Expense category not found before expense deletion. Expected Expense Category: ${deletedExpense.categoryId}. ExpenseId: ${deletedExpense.id}`,
        )

      expenseSubCategory = expenseCategory.subCategories.find(
        (sub) => sub.id === deletedExpense.subCategoryId,
      )
    }

    // Return the deleted expense id
    return dbExpenseToDomainExpense({
      ...deletedExpense,
      category: expenseCategory,
      subCategory: expenseSubCategory,
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    const dbError = error as Error
    console.error(`Failed to delete expense for expenseId: ${input.id}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to delete expense. Error: ${dbError.message}`)
  }
}
