import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { incomeTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Income } from '../../models/income/income'
import { dbIncomeToDomainIncome } from '../../utilities/mappers/income/DBIncomeToDomainIncome'

export interface DeleteIncome {
  id: string
}

export async function deleteIncomeRepository(input: DeleteIncome): Promise<Income> {
  try {
    const [deletedIncome] = await db
      .delete(incomeTable)
      .where(eq(incomeTable.id, input.id))
      .returning()

    if (!deletedIncome) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR}: Income not found for deletion. Expected IncomeId: ${input.id}`,
      )
    }

    return dbIncomeToDomainIncome(deletedIncome)
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    const dbError = error as Error
    console.error(`Failed to delete income for incomeId: ${input.id}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to delete income. Error: ${dbError.message}`)
  }
}
