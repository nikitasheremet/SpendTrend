import { Expense } from '../../models/expense/Expense'
import { getExpensesRepository } from '../repository/getExpensesRepository'

export interface GetExpensesServiceInput {
  accountId: string
}

export async function getExpensesService(input: GetExpensesServiceInput): Promise<Expense[]> {
  return getExpensesRepository(input)
}
