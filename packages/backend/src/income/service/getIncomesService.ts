import { integerToDecimal } from '../../utilities/integerToDecimal'
import { GetIncomesQuery, getIncomesRepository } from '../repository/getIncomesRepository'
import { GetIncomesInput } from '../validation/models'

export async function getIncomesService(input: GetIncomesInput) {
  const getIncomesQuery: GetIncomesQuery = { accountId: input.accountId }
  let incomes = await getIncomesRepository(getIncomesQuery)
  incomes = incomes.map((income) => ({
    ...income,
    amount: integerToDecimal(income.amount),
  }))
  return incomes
}
