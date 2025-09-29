import { GetIncomeQuery, getIncomeRepository } from '../repository/getIncomeRepository'
import { GetIncomeInput } from '../validation/models'

export async function getIncomeService(input: GetIncomeInput) {
  const getIncomeQuery: GetIncomeQuery = { accountId: input.accountId }
  return getIncomeRepository(getIncomeQuery)
}