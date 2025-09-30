import { Income } from '@/types/income/income'
import { Income as ContractIncome } from '@contracts/income/models'

export function apiIncomeToDomain(contractIncome: ContractIncome): Income {
  return {
    id: contractIncome.id,
    userId: contractIncome.userId,
    accountId: contractIncome.accountId,
    name: contractIncome.name,
    amount: contractIncome.amount,
    date: contractIncome.date,
    createdAt: contractIncome.createdAt,
    updatedAt: contractIncome.updatedAt,
  }
}
