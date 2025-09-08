import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { expenseCategoriesTable, expensesTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { Expense } from '../../models/expense/Expense'
import { dbExpenseToDomainExpense } from '../../utilities/mappers/expense/DBExpenseToDomainExpense'
import { ExpenseCategoryDbRow } from '../../models/expenseCategory/expenseCategory'
import { DbExpenseCategoryWithSubCategories } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export interface CreateExpense {
  userId: string
  accountId: string
  name: string
  amount: number
  netAmount: number
  date: string
  categoryId: string
  subCategoryId: string
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
        categoryId: input.categoryId,
        subCategoryId: input.subCategoryId,
        paidBackAmount: input.paidBackAmount,
        netAmount: input.netAmount,
      })
      .returning()

    const expenseCategory = await db.query.expenseCategoriesTable.findFirst({
      where: eq(expenseCategoriesTable.id, createdExpense.categoryId),
      with: { subCategories: true },
    })
    if (!expenseCategory)
      throw new RepositoryError(
        `${DB_ERROR}: Expense category not found after expense creation. Possible race condition. Expected Expense Category: ${createdExpense.categoryId}. ExpenseId: ${createdExpense.id}`,
      )

    const expenseSubCategory = expenseCategory.subCategories.find(
      (sub) => sub.id === createdExpense.subCategoryId,
    )
    if (!expenseSubCategory)
      throw new RepositoryError(
        `${DB_ERROR}: Expense subCategory not found after expense creation. Possible race condition. Expected Expense SubCategory: ${createdExpense.subCategoryId}. ExpenseId: ${createdExpense.id}`,
      )

    return dbExpenseToDomainExpense({
      ...createdExpense,
      category: expenseCategory,
      subCategory: expenseSubCategory,
    })
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to create expense for userId: ${input.userId}`, dbError)
    throw new RepositoryError(`${DB_ERROR}: Failed to create expense. Error: ${dbError.message}`)
  }
}
