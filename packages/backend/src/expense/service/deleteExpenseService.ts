import { Expense } from '../../models/expense/expense'
import { deleteExpenseRepository } from '../repository/deleteExpenseRepository'

export interface DeleteExpenseServiceInput {
  expenseId: string
}

export async function deleteExpenseService(input: DeleteExpenseServiceInput): Promise<Expense> {
  return await deleteExpenseRepository({ id: input.expenseId })
}
