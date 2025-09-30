import { eq, desc } from 'drizzle-orm'
import { db } from '../../db'
import { incomeTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Income } from '../../models/income/income'
import { dbIncomeToDomainIncome } from '../../utilities/mappers/income/DBIncomeToDomainIncome'

export interface GetIncomesQuery {
  accountId: string
}

export async function getIncomesRepository(query: GetIncomesQuery): Promise<Income[]> {
  try {
    const incomeRecords = await db
      .select()
      .from(incomeTable)
      .where(eq(incomeTable.accountId, query.accountId))
      .orderBy(desc(incomeTable.date))

    return incomeRecords.map(dbIncomeToDomainIncome)
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to get income for accountId: ${query.accountId}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to get income. Error: ${dbError.message}`)
  }
}
