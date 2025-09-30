import { Income } from '@/types/income/income'
import { Income as ContractIncome } from '@contracts/income/models'
import { apiIncomeToDomain } from './apiIncomeToDomain'

export function getIncomesResponseToDomain(incomes: ContractIncome[]): Income[] {
  return incomes.map(apiIncomeToDomain)
}
