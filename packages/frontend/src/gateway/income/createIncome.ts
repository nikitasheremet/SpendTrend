import { Income, NewIncome } from '@/types/income/income'
import { CreateIncomeResponse } from '@contracts/income/createIncome'
import { post } from '@gateway/post'
import { apiIncomeToDomain } from '../mappers/income/apiIncomeToDomain'

export interface CreateIncomeRequest extends Required<NewIncome> {
  userId: string
  accountId: string
}

export async function createIncome(income: CreateIncomeRequest): Promise<Income> {
  const response = await post<CreateIncomeResponse>('createincome', income)
  return apiIncomeToDomain(response.createdIncome)
}
