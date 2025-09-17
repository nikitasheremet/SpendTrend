import { db } from '../../db'
import { expenseSubCategoriesTable } from '../../db/schema'
import { ExpenseSubCategory } from '../../models/expenseSubCategory/expenseSubCategory'
import { dbExpenseSubCategoryToDomain } from '../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain'
import { DB_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'

export interface CreateExpenseSubCategory {
  userId: string
  accountId: string
  categoryId: string
  name: string
}

export async function createExpenseSubCategoryRepository(
  input: CreateExpenseSubCategory,
): Promise<ExpenseSubCategory> {
  try {
    const [createdSubCategory] = await db
      .insert(expenseSubCategoriesTable)
      .values({
        userId: input.userId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        name: input.name,
      })
      .returning()

    return dbExpenseSubCategoryToDomain(createdSubCategory)
  } catch (error) {
    const dbError = error as Error
    console.error(`Failed to create expense subCategory for userId: ${input.userId}`, dbError)
    throw new RepositoryError(
      `${DB_ERROR}: Failed to create expense subCategory. Error: ${dbError.message}`,
    )
  }
}
