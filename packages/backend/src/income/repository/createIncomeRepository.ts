import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { incomeTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Income } from '../../models/income/income'
import { dbIncomeToDomainIncome } from '../../utilities/mappers/income/DBIncomeToDomainIncome'

export interface CreateIncome {
  userId: string
  accountId: string
  name: string
  amount: number
  date: string
}

export async function createIncomeRepository(input: CreateIncome): Promise<Income> {
  try {
    const [createdIncome] = await db
      .insert(incomeTable)
      .values({
        userId: input.userId,
        accountId: input.accountId,
        name: input.name,
        amount: input.amount,
        date: input.date,
      })
      .returning()

    return dbIncomeToDomainIncome(createdIncome)
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to create income for userId: ${input.userId} and accountId: ${input.accountId}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to create income. Error: ${dbError.message}`)
  }
}
