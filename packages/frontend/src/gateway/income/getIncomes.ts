import { GetIncomesResponse } from '@contracts/income/getIncomes'
import { get } from '@gateway/get'
import { getIncomesResponseToDomain } from '../mappers/income/getIncomesResponseToDomain'
import { Income } from '@/types/income/income'

export interface GetIncomesRequest {
  userId: string
  accountId: string
}

export async function getIncomes(request: GetIncomesRequest): Promise<Income[]> {
  const response = await get<GetIncomesResponse>('incomes', {
    userId: request.userId,
    accountId: request.accountId,
  })
  return getIncomesResponseToDomain(response.incomes)
}
