import {
  ExpenseCategoryDbRow,
  ExpenseCategory,
} from '../../../models/expenseCategory/expenseCategory'

export function dbExpenseCategoryToDomain(
  dbExpenseCategory: ExpenseCategoryDbRow,
): ExpenseCategory {
  const { id, userId, accountId, name, subcategories, createdAt, updatedAt } = dbExpenseCategory
  return {
    id,
    userId,
    accountId,
    name,
    subcategories,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}
