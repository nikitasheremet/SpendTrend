import {
  ExpenseCategory,
  ExpenseCategoryDbRow,
} from '../../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from './dBExpenseCategoryToDomain'

export function dbExpenseCategoriesToDomainCategories(
  dbExpenseCategories: ExpenseCategoryDbRow[],
): ExpenseCategory[] {
  return dbExpenseCategories.map(dbExpenseCategoryToDomain)
}
