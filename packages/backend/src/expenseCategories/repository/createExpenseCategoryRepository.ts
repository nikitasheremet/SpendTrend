import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export interface CreateExpenseCategoryRepoInput {
  userId: string
  accountId: string
  name: string
}

export async function createExpenseCategoryRepository(
  input: CreateExpenseCategoryRepoInput,
): Promise<ExpenseCategory> {
  try {
    const [createdExpenseCategory] = await db
      .insert(expenseCategoriesTable)
      .values(input)
      .returning()

    // Since this is a newly created category, it won't have any subcategories yet
    const categoryWithSubCategories = {
      ...createdExpenseCategory,
      subCategories: [],
    }

    return dbExpenseCategoryToDomain(categoryWithSubCategories)
  } catch (error) {
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
