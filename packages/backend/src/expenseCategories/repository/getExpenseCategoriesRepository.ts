import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { eq } from 'drizzle-orm'
import { dbExpenseCategoriesToDomainCategories } from '../../utilities/mappers/expenseCategory/dbExpenseCategoriesToDomainCategories'

export interface GetExpenseCategoriesRepoInput {
  accountId: string
}

export async function getExpenseCategoriesRepository(
  input: GetExpenseCategoriesRepoInput,
): Promise<ExpenseCategory[]> {
  try {
    const { accountId } = input
    const rows = await db.query.expenseCategoriesTable.findMany({
      where: eq(expenseCategoriesTable.accountId, accountId),
      with: {
        subCategories: true,
      },
    })
    return dbExpenseCategoriesToDomainCategories(rows)
  } catch (error) {
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
