import { ExpensesTableRow } from '../../../db/schema'
import { Expense } from '../../../models/expense/Expense'
import { ExpenseCategoryDbRow } from '../../../models/expenseCategory/expenseCategory'
import { dbExpenseCategoryToDomain } from '../expenseCategory/dBExpenseCategoryToDomain'

export interface DbExpenseWithExpenseCategory extends Omit<ExpensesTableRow, 'category'> {
  category: ExpenseCategoryDbRow
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
    subCategory: dbExpense.subCategory,
    paidBackAmount: dbExpense.paidBackAmount,
    createdAt: dbExpense.createdAt.toISOString(),
    updatedAt: dbExpense.updatedAt.toISOString(),
  }
}

export function dbExpensesToDomainExpenses(dbExpenses: DbExpenseWithExpenseCategory[]): Expense[] {
  return dbExpenses.map(dbExpenseToDomainExpense)
}
