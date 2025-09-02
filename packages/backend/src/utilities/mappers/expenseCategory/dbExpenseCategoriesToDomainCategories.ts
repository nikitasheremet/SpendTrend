import {
  ExpenseCategoriesDbRow,
  ExpenseCategory,
} from '../../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from './dBExpenseCategoryToDomain'

export function dbExpenseCategoriesToDomainCategories(
  dbExpenseCategories: ExpenseCategoriesDbRow[],
): ExpenseCategory[] {
  return dbExpenseCategories.map(dbExpenseCategoryToDomain)
}
