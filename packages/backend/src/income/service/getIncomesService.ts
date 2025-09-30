import { GetIncomesQuery, getIncomesRepository } from '../repository/getIncomesRepository'
import { GetIncomesInput } from '../validation/models'

export async function getIncomesService(input: GetIncomesInput) {
  const getIncomesQuery: GetIncomesQuery = { accountId: input.accountId }
  return getIncomesRepository(getIncomesQuery)
}
