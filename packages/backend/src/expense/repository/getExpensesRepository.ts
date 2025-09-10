import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { expensesTable } from '../../db/schema'
import { DB_ERROR } from '../../models/errors/repositoryErrors'
import { dbExpensesToDomainExpenses } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { Expense } from '../../models/expense/expense'

interface GetExpensesRepositoryInput {
  accountId: string
}

export async function getExpensesRepository(input: GetExpensesRepositoryInput): Promise<Expense[]> {
  try {
    const { accountId } = input

    const expenses = await db.query.expensesTable.findMany({
      with: {
        category: {
          with: { subCategories: true },
        },
        subCategory: true,
      },
      where: eq(expensesTable.accountId, accountId),
      orderBy: [desc(expensesTable.date)],
    })

    return dbExpensesToDomainExpenses(expenses)
  } catch (error) {
    console.error(`${DB_ERROR}: GetExpensesRepository,`, error, input.accountId)
    throw new Error(`${DB_ERROR}: Failed to fetch expenses for accountId: ${input.accountId}`)
  }
}
