import { UpdateIncomeResponse } from '@contracts/income/updateIncome'
import { put } from '@gateway/put'
import { Income } from '@/types/income/income'
import { apiIncomeToDomain } from '../mappers/income/apiIncomeToDomain'

export interface UpdateIncomeRequest {
  userId: string
  accountId: string
  id: string
  name: string
  amount: number
  date: string
}

export async function updateIncome(request: UpdateIncomeRequest): Promise<Income> {
  const response = await put<UpdateIncomeResponse>('updateincome', request)
  return apiIncomeToDomain(response.updatedIncome)
}
