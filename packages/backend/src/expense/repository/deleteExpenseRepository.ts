import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Expense } from '../../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'


export interface DeleteExpense {
  id: string
}

export async function deleteExpenseRepository(input: DeleteExpense): Promise<Expense> {
  try {
    // Find the expense to delete
    const [deletedExpense] = await db
      .delete(expensesTable)
      .where(
        eq(expensesTable.id, input.id)
      ).returning()

    if (!deletedExpense) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR}: Expense not found for deletion. Expected ExpenseId: ${input.id}`,
      )
    }

    // Get the category and subcategory for the expense
    const expenseCategory = await db.query.expenseCategoriesTable.findFirst({
      where: eq(expenseCategoriesTable.id, deletedExpense.categoryId),
      with: { subCategories: true },
    })
    if (!expenseCategory)
      throw new RepositoryError(
        `${DB_ERROR}: Expense category not found before expense deletion. Expected Expense Category: ${deletedExpense.categoryId}. ExpenseId: ${deletedExpense.id}`,
      )

    const expenseSubCategory = expenseCategory.subCategories.find(
      (sub) => sub.id === deletedExpense.subCategoryId,
    )
    if (!expenseSubCategory)
      throw new RepositoryError(
        `${DB_ERROR}: Expense subCategory not found before expense deletion. Expected Expense SubCategory: ${deletedExpense.subCategoryId}. ExpenseId: ${deletedExpense.id}`,
      )

    // Return the deleted expense id
    return dbExpenseToDomainExpense({
      ...deletedExpense,
      category: expenseCategory,
      subCategory: expenseSubCategory,
    })
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to delete expense for expenseId: ${input.id}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to delete expense. Error: ${dbError.message}`)
  }
}
