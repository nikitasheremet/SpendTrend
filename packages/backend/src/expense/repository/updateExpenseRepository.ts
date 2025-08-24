import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expensesTable, ExpensesTableRow } from '../../db/schema'
import { Expense } from '../../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'

export interface UpdateExpenseRepository {
  id: string
  fieldsToUpdate: Partial<ExpensesTableRow>
}

export async function updateExpenseRepository(input: UpdateExpenseRepository): Promise<Expense> {
  const updatedRows = await db
    .update(expensesTable)
    .set(input.fieldsToUpdate)
    .where(eq(expensesTable.id, input.id))
    .returning()

  if (updatedRows.length === 0) {
    throw new RepositoryError(
      `${NOT_FOUND_ERROR} - No expense found to update with id: ${input.id}`,
    )
  }

  return dbExpenseToDomainExpense(updatedRows[0])
}
