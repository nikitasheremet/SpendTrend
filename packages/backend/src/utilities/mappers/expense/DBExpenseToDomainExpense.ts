import { Expense } from '../../../models/expense/Expense'

export function dbExpenseToDomainExpense(dbExpense: any): Expense {
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
