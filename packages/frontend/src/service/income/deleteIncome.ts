import { deleteIncome as deleteIncomeGateway } from '@/gateway/income/deleteIncome'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

export async function deleteIncome(incomeId: string): Promise<Income> {
  const { userId, accountId } = getStore().getAccountDetails()
  try {
    const request = {
      userId,
      accountId,
      id: incomeId,
    }
    return await deleteIncomeGateway(request)
  } catch (error) {
    console.error('Failed to delete income', incomeId, error)
    throw error
  }
}
