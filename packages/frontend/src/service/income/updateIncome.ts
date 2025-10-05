import { updateIncome as updateIncomeGateway } from '@/gateway/income/updateIncome'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

export async function updateIncome(income: Income): Promise<Income> {
  const { userId, accountId } = await getStore().getAccountDetails()
  try {
    const request = {
      userId,
      accountId,
      id: income.id,
      name: income.name,
      amount: income.amount,
      date: income.date,
    }
    return await updateIncomeGateway(request)
  } catch (error) {
    console.error('Failed to update income', income.id, error)
    throw error
  }
}
