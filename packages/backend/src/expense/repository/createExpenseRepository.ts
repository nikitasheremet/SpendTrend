import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Expense } from '../../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { ExpenseCategoryDbRow } from '../../models/expenseCategory/expenseCategory'

export interface CreateExpense {
  userId: string
  accountId: string
  name: string
  amount: number
  netAmount: number
  date: string
  categoryId: string
  subCategory: string
  paidBackAmount: number
}

export async function createExpenseRepository(input: CreateExpense): Promise<Expense> {
  try {
    const [createdExpense] = await db
      .insert(expensesTable)
      .values({
        userId: input.userId,
        accountId: input.accountId,
        name: input.name,
        amount: input.amount,
        date: input.date,
        category: input.categoryId,
        subCategory: input.subCategory,
        paidBackAmount: input.paidBackAmount,
        netAmount: input.netAmount,
      })
      .returning()

    // If the above insert was successful then the category must exist
    const expenseCategory = (await db.query.expenseCategoriesTable.findFirst({
      where: eq(expenseCategoriesTable.id, input.categoryId),
    })) as ExpenseCategoryDbRow

    return dbExpenseToDomainExpense({ ...createdExpense, category: expenseCategory })
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to create expense for userId: ${input.userId}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to create expense. Error: ${dbError.message}`)
  }
}
