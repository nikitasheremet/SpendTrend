import {
  ExpenseSubCategory,
  ExpenseSubCategoryDbRow,
} from '../../../models/expenseSubCategory/expenseSubCategory'

export function dbExpenseSubCategoryToDomain(
  dbSubCategory: ExpenseSubCategoryDbRow,
): ExpenseSubCategory {
  return {
    id: dbSubCategory.id,
    userId: dbSubCategory.userId,
    accountId: dbSubCategory.accountId,
    name: dbSubCategory.name,
    categoryId: dbSubCategory.categoryId,
    createdAt: dbSubCategory.createdAt,
    updatedAt: dbSubCategory.updatedAt,
  }
}
