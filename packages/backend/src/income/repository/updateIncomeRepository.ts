import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { incomeTable } from '../../db/schema'
import { Income, IncomeDbRow } from '../../models/income/income'
import { dbIncomeToDomainIncome } from '../../utilities/mappers/income/DBIncomeToDomainIncome'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'

export interface UpdateIncomeRepository {
  id: string
  fieldsToUpdate: Partial<IncomeDbRow>
}

export async function updateIncomeRepository(input: UpdateIncomeRepository): Promise<Income> {
  try {
    const [updatedIncome] = await db
      .update(incomeTable)
      .set(input.fieldsToUpdate)
      .where(eq(incomeTable.id, input.id))
      .returning()

    if (!updatedIncome) {
      throw new RepositoryError(
        `${NOT_FOUND_ERROR} - No income found to update with id: ${input.id}`,
      )
    }

    return dbIncomeToDomainIncome(updatedIncome)
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error
    }
    const dbError = error as Error
    throw new RepositoryError(`${DB_ERROR}: Failed to update income. Error: ${dbError.message}`)
  }
}
