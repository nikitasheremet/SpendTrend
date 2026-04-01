import { ExpenseCategory } from '../../../models/expenseCategory/expenseCategory'
import {
  dbExpenseCategoryToDomain,
  DbExpenseCategoryWithSubCategories,
} from './dBExpenseCategoryToDomain'

export function dbExpenseCategoriesToDomainCategories(
  dbExpenseCategories: DbExpenseCategoryWithSubCategories[],
): (ExpenseCategory | undefined)[] {
  return dbExpenseCategories.map(dbExpenseCategoryToDomain)
}
