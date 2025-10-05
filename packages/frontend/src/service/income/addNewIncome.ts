import { createIncome } from '@/gateway/income/createIncome'
import { getStore } from '@/store/store'
import type { Income, NewIncome } from '@/types/income/income'

export async function addNewIncome(newIncomeData: Required<NewIncome>): Promise<Income> {
  const { userId, accountId } = await getStore().getAccountDetails()
  const createIncomeRequest = {
    name: newIncomeData.name,
    amount: newIncomeData.amount,
    date: newIncomeData.date,
    userId,
    accountId,
  }
  return await createIncome(createIncomeRequest)
}
