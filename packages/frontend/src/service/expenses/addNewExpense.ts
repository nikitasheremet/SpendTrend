import { createExpense } from '@/gateway/expense/createExpense'
import { getStore } from '@/store/store'
import type { Expense, NewExpense } from '@/types/expenseData'

export async function addNewExpense(newExpenseData: NewExpense): Promise<Expense> {
  const { userId, accountId } = await getStore().getAccountDetails()
  const newExpenseRequest = {
    name: newExpenseData.name,
    amount: newExpenseData.amount,
    netAmount: newExpenseData.netAmount,
    date: newExpenseData.date,
    paidBackAmount: newExpenseData.paidBackAmount ?? 0,
    categoryId: newExpenseData.category,
    subCategoryId: newExpenseData.subCategory || undefined,
    userId,
    accountId,
  }
  return await createExpense(newExpenseRequest)
}
