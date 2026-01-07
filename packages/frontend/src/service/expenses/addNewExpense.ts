import { createExpense } from '@/gateway/expense/createExpense'
import { getStore } from '@/store/store'
import type { Expense, NewExpense } from '@/types/expenseData'

export async function addNewExpense(newExpensesData: NewExpense[]): Promise<{
  createdExpenses: Array<Expense>
  failedExpenses: Array<{ expenseInput: NewExpense; errorMessage: string }>
}> {
  const { userId, accountId } = await getStore().getAccountDetails()
  const newExpenseRequest = []

  for (const newExpenseData of newExpensesData) {
    const newExpense = {
      name: newExpenseData.name,
      amount: newExpenseData.amount,
      netAmount: newExpenseData.netAmount,
      date: newExpenseData.date,
      paidBackAmount: newExpenseData.paidBackAmount ?? 0,
      categoryId: newExpenseData.category,
      subCategoryId: newExpenseData.subCategory || undefined,
    }
    newExpenseRequest.push(newExpense)
  }
  return await createExpense({
    userId,
    accountId,
    expensesToCreate: newExpenseRequest,
  })
}
