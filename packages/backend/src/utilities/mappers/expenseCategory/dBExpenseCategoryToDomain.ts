import {
  ExpenseCategoryDbRow,
  ExpenseCategory,
} from '../../../models/expenseCategory/expenseCategory'
import { ExpenseSubCategoryDbRow } from '../../../models/expenseSubCategory/expenseSubCategory'
import { dbExpenseSubCategoryToDomain } from '../expenseSubCategory/dbExpenseSubCategoryToDomain'

export interface DbExpenseCategoryWithSubCategories extends ExpenseCategoryDbRow {
  subCategories: ExpenseSubCategoryDbRow[]
}

export function dbExpenseCategoryToDomain(
  dbExpenseCategory?: DbExpenseCategoryWithSubCategories | null,
): ExpenseCategory | undefined {
  if (!dbExpenseCategory) {
    return undefined
  }
  const { id, userId, accountId, name, subCategories, createdAt, updatedAt } = dbExpenseCategory
  return {
    id,
    userId,
    accountId,
    name,
    subCategories: subCategories.map(dbExpenseSubCategoryToDomain),
    createdAt,
    updatedAt,
  }
}
