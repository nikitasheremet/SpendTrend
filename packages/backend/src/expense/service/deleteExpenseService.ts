import { Expense } from '../../models/expense/expense'
import { integerToDecimal } from '../../utilities/integerToDecimal'
import { deleteExpenseRepository } from '../repository/deleteExpenseRepository'
import { convertDbAmountToDecimals } from './helpers/convertDbAmountToDecimals'

export interface DeleteExpenseServiceInput {
  expenseId: string
}

export async function deleteExpenseService(input: DeleteExpenseServiceInput): Promise<Expense> {
  let deletedExpense = await deleteExpenseRepository({ id: input.expenseId })
  deletedExpense = convertDbAmountToDecimals(deletedExpense)
  return deletedExpense
}
