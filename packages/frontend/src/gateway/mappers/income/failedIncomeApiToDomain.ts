import { NewIncome as DomainNewIncome } from '@/types/income/income'
import { NewIncome as ApiNewIncome } from '@contracts/income/models'

type ApiFailedIncome = { incomeInput: ApiNewIncome; errorMessage: string }
type DomainFailedIncome = { incomeInput: DomainNewIncome; errorMessage: string }

function apiNewIncomeToDomain(input: ApiNewIncome): DomainNewIncome {
  return {
    name: input.name,
    amount: input.amount,
    date: input.date,
  }
}

export function apiFailedIncomeToDomain(input: ApiFailedIncome): DomainFailedIncome {
  return {
    incomeInput: apiNewIncomeToDomain(input.incomeInput),
    errorMessage: input.errorMessage,
  }
}

export function apiFailedIncomesToDomain(input: ApiFailedIncome[]): DomainFailedIncome[] {
  return input.map(apiFailedIncomeToDomain)
}
