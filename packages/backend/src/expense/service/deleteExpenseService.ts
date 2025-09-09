import { Expense } from '../../models/expense/Expense'
import { deleteExpenseRepository } from '../repository/deleteExpenseRepository'

export interface DeleteExpensesServiceInput {
  expenseId: string
}

export async function deleteExpenseService(input: DeleteExpensesServiceInput): Promise<Expense> {
  return await deleteExpenseRepository({ id: input.expenseId })
}
