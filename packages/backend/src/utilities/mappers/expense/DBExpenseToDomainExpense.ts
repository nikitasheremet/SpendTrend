import { Expense, ExpensesDbRow } from '../../../models/expense/Expense'
import { ExpenseSubCategoryDbRow } from '../../../models/expenseSubCategory/expenseSubCategory'
import {
  dbExpenseCategoryToDomain,
  DbExpenseCategoryWithSubCategories,
} from '../expenseCategory/dBExpenseCategoryToDomain'
import { dbExpenseSubCategoryToDomain } from '../expenseSubCategory/dbExpenseSubCategoryToDomain'

export interface DbExpenseWithExpenseCategory extends Omit<ExpensesDbRow, 'categoryId'> {
  category: DbExpenseCategoryWithSubCategories
  subCategory: ExpenseSubCategoryDbRow
}

export function dbExpenseToDomainExpense(dbExpense: DbExpenseWithExpenseCategory): Expense {
  return {
    id: dbExpense.id,
    userId: dbExpense.userId,
    accountId: dbExpense.accountId,
    name: dbExpense.name,
    amount: dbExpense.amount,
    netAmount: dbExpense.netAmount,
    date: dbExpense.date,
    category: dbExpenseCategoryToDomain(dbExpense.category),
    subCategory: dbExpenseSubCategoryToDomain(dbExpense.subCategory),
    paidBackAmount: dbExpense.paidBackAmount,
    createdAt: dbExpense.createdAt.toISOString(),
    updatedAt: dbExpense.updatedAt.toISOString(),
  }
}

export function dbExpensesToDomainExpenses(dbExpenses: DbExpenseWithExpenseCategory[]): Expense[] {
  return dbExpenses.map(dbExpenseToDomainExpense)
}
