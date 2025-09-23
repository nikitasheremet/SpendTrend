import { createExpense } from '@/gateway/expense/createExpense'
import { getStore } from '@/store/store'
import type { Expense, NewExpense } from '@/types/expenseData'

export async function addNewExpense(newExpenseData: NewExpense): Promise<Expense> {
  const { userId, accountId } = getStore().getAccountDetails()
  const newExpenseRequest = {
    ...newExpenseData,
    userId,
    accountId,
  }
  return await createExpense(newExpenseRequest)
}
