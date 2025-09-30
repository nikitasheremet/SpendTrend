import { getIncomes } from '@/gateway/income/getIncomes'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

export async function getAllIncomes(): Promise<Income[]> {
  const { userId, accountId } = getStore().getAccountDetails()
  return await getIncomes({ userId, accountId })
}
