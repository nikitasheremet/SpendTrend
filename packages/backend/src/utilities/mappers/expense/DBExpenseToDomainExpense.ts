import { ExpensesTableRow } from '../../../db/schema'
import { Expense } from '../../../models/expense/Expense'

export function dbExpenseToDomainExpense(dbExpense: ExpensesTableRow): Expense {
  return {
    id: dbExpense.id,
    userId: dbExpense.userId,
    accountId: dbExpense.accountId,
    name: dbExpense.name,
    amount: dbExpense.amount,
    netAmount: dbExpense.netAmount,
    date: dbExpense.date,
    category: dbExpense.category,
    subCategory: dbExpense.subCategory,
    paidBackAmount: dbExpense.paidBackAmount,
    createdAt: dbExpense.createdAt.toISOString(),
    updatedAt: dbExpense.updatedAt.toISOString(),
  }
}

export function dbExpensesToDomainExpenses(dbExpenses: ExpensesTableRow[]): Expense[] {
  return dbExpenses.map(dbExpenseToDomainExpense)
}
