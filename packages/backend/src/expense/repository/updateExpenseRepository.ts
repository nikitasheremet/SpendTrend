import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable, ExpensesTableRow } from '../../db/schema'
import { Expense } from '../../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategoryDbRow } from '../../models/expenseCategory/expenseCategory'

export interface UpdateExpenseRepository {
  id: string
  fieldsToUpdate: Partial<ExpensesTableRow>
}

export async function updateExpenseRepository(input: UpdateExpenseRepository): Promise<Expense> {
  const [updatedRow] = await db
    .update(expensesTable)
    .set(input.fieldsToUpdate)
    .where(eq(expensesTable.id, input.id))
    .returning()

  if (!updatedRow) {
    throw new RepositoryError(
      `${NOT_FOUND_ERROR} - No expense found to update with id: ${input.id}`,
    )
  }

  const expenseCategory = (await db.query.expenseCategoriesTable.findFirst({
    where: eq(expenseCategoriesTable.id, updatedRow.categoryId),
  })) as ExpenseCategoryDbRow

  return dbExpenseToDomainExpense({ ...updatedRow, category: expenseCategory })
}
