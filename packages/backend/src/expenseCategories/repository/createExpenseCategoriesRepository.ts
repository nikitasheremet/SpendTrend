import { db } from '../../db'
import { expenseCategoriesTable } from '../../db/schema'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../models/errors/repositoryErrors'
import { ExpenseCategory, ExpenseCategoryDbRow } from '../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export interface CreateExpenseCategoriesRepoInput {
  userId: string
  accountId: string
  name: string[]
}

function mapDbExpenseCategoryWithSubCategories(
  dbExpenseCategory: ExpenseCategoryDbRow,
): ExpenseCategory {
  const categoryWithSubCategories = {
    ...dbExpenseCategory,
    subCategories: [],
  }

  const mappedCategory = dbExpenseCategoryToDomain(categoryWithSubCategories)
  if (!mappedCategory) {
    throw new RepositoryError(
      `${NOT_FOUND_ERROR} - No expense category found with id: ${dbExpenseCategory.id}`,
    )
  }

  return mappedCategory
}

export async function createExpenseCategoriesRepository(
  input: CreateExpenseCategoriesRepoInput,
): Promise<ExpenseCategory[]> {
  try {
    const categoriesInput = input.name.map((expenseCategoryName) => ({
      userId: input.userId,
      accountId: input.accountId,
      name: expenseCategoryName,
    }))

    if (categoriesInput.length === 0) {
      return []
    }

    const createdExpenseCategories = await db
      .insert(expenseCategoriesTable)
      .values(categoriesInput)
      .returning()

    return createdExpenseCategories.map(mapDbExpenseCategoryWithSubCategories)
  } catch (error) {
    throw new RepositoryError(`${DB_ERROR}: ${(error as Error).message}`)
  }
}
