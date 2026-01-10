import { createIncome } from '@/gateway/income/createIncome'
import { getStore } from '@/store/store'
import type { FailedIncome, Income, NewIncome } from '@/types/income/income'

export async function addNewIncome(newIncomeData: NewIncome[]): Promise<{
  createdIncomes: Array<Income>
  failedIncomes: Array<FailedIncome>
}> {
  const { userId, accountId } = await getStore().getAccountDetails()
  const createIncomeRequest = {
    userId,
    accountId,
    incomesToCreate: newIncomeData.map((income) => ({
      name: income.name as string,
      amount: income.amount as number,
      date: income.date as string,
    })),
  }

  return await createIncome(createIncomeRequest)
}
