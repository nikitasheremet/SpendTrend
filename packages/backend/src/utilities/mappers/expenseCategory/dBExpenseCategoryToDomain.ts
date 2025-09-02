import {
  ExpenseCategoriesDbRow,
  ExpenseCategory,
} from '../../../models/expenseCategory/expenseCategory'

export function dbExpenseCategoryToDomain(
  dbExpenseCategory: ExpenseCategoriesDbRow,
): ExpenseCategory {
  const { userId, accountId, name, subcategories, createdAt, updatedAt } = dbExpenseCategory
  return {
    userId,
    accountId,
    name,
    subcategories,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}
