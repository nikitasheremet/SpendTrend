import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable } from '../../db/schema'
import { Expense, ExpensesDbRow } from '../../models/expense/expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'

export interface UpdateExpenseRepository {
  id: string
  fieldsToUpdate: Partial<ExpensesDbRow>
}

export async function updateExpenseRepository(input: UpdateExpenseRepository): Promise<Expense> {
  const [updateExpense] = await db
    .update(expensesTable)
    .set(input.fieldsToUpdate)
    .where(eq(expensesTable.id, input.id))
    .returning()

  if (!updateExpense) {
    throw new RepositoryError(
      `${NOT_FOUND_ERROR} - No expense found to update with id: ${input.id}`,
    )
  }

  const expenseCategory = await db.query.expenseCategoriesTable.findFirst({
    where: eq(expenseCategoriesTable.id, updateExpense.categoryId),
    with: { subCategories: true },
  })
  if (!expenseCategory)
    throw new RepositoryError(
      `${DB_ERROR}: Expense category not found after expense creation. Possible race condition. Expected Expense Category: ${updateExpense.categoryId}. ExpenseId: ${updateExpense.id}`,
    )

  const expenseSubCategory = expenseCategory.subCategories.find(
    (sub) => sub.id === updateExpense.subCategoryId,
  )

  return dbExpenseToDomainExpense({
    ...updateExpense,
    category: expenseCategory,
    subCategory: expenseSubCategory,
  })
}
