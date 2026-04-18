import { createExpenseCategoriesService } from '../../expenseCategories/service'

const DEFAULT_EXPENSE_CATEGORY_NAMES = ['Food', 'Car', 'Home', 'Activity', 'Travel']
const CREATE_DEFAULT_CATEGORIES_ERROR_MESSAGE =
  'Failed to create default expense categories after account creation'

interface CreateDefaultExpenseCategoriesDatabaseHookInput {
  accountId: string
  userId: string
}

export async function createDefaultExpenseCategoriesDatabaseHook(
  input: CreateDefaultExpenseCategoriesDatabaseHookInput,
): Promise<void> {
  try {
    await createExpenseCategoriesService({
      userId: input.userId,
      accountId: input.accountId,
      name: DEFAULT_EXPENSE_CATEGORY_NAMES,
    })
  } catch (error) {
    console.error(CREATE_DEFAULT_CATEGORIES_ERROR_MESSAGE, {
      accountId: input.accountId,
      userId: input.userId,
      error,
    })
    throw error
  }
}
