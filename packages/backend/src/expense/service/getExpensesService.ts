import { Expense } from '../../models/expense/expense'
import { integerToDecimal } from '../../utilities/integerToDecimal'
import { getExpensesRepository } from '../repository/getExpensesRepository'
import { convertDbAmountToDecimals } from './helpers/convertDbAmountToDecimals'

export interface GetExpensesServiceInput {
  accountId: string
}

export async function getExpensesService(input: GetExpensesServiceInput): Promise<Expense[]> {
  let expenses = await getExpensesRepository(input)
  expenses = expenses.map((expense) => {
    return convertDbAmountToDecimals(expense)
  })
  return expenses
}
