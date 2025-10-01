import { DeleteIncomeResponse } from '@contracts/income/deleteIncome'
import { post } from '@gateway/post'
import { Income } from '@/types/income/income'
import { apiIncomeToDomain } from '../mappers/income/apiIncomeToDomain'

export interface DeleteIncomeRequest {
  userId: string
  accountId: string
  id: string
}

export async function deleteIncome(request: DeleteIncomeRequest): Promise<Income> {
  const response = await post<DeleteIncomeResponse>('deleteincome', request)
  return apiIncomeToDomain(response.deletedIncome)
}
