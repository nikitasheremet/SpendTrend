import { ExpenseCategoriesDbRow, ExpenseCategory } from './expenseCategory'
import { dbExpenseCategoryToDomain } from '../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

export function dbExpenseCategoriesToDomainCategories(
  dbExpenseCategories: ExpenseCategoriesDbRow[],
): ExpenseCategory[] {
  return dbExpenseCategories.map(dbExpenseCategoryToDomain)
}
