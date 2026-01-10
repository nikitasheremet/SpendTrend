import { FailedIncome, Income, NewIncome } from '@/types/income/income'
import { CreateIncomeResponse } from '@contracts/income/createIncome'
import { post } from '@gateway/post'
import { apiIncomeToDomain } from '../mappers/income/apiIncomeToDomain'
import { apiFailedIncomesToDomain } from '@gateway/mappers/income/failedIncomeApiToDomain'

type CreateIncomesArray = Array<Required<Pick<NewIncome, 'name' | 'amount' | 'date'>>>

export interface CreateIncomeRequest {
  userId: string
  accountId: string
  incomesToCreate: CreateIncomesArray
}

export async function createIncome(incomes: CreateIncomeRequest): Promise<{
  createdIncomes: Array<Income>
  failedIncomes: Array<FailedIncome>
}> {
  const response = await post<CreateIncomeResponse>('createincome', incomes)
  return {
    createdIncomes: response.createdIncomes.map(apiIncomeToDomain),
    failedIncomes: apiFailedIncomesToDomain(response.failedIncomes),
  }
}
