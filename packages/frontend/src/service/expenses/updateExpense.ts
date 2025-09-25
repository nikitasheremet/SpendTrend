import type { Expense } from '@/types/expenseData'
import { updateExpense as gatewayUpdateExpense } from '@/gateway/expense/updateExpense'

export async function updateExpense(updatedExpense: Expense): Promise<Expense> {
  const request = {
    id: updatedExpense.id,
    userId: updatedExpense.userId,
    accountId: updatedExpense.accountId,
    name: updatedExpense.name,
    amount: updatedExpense.amount,
    netAmount: updatedExpense.netAmount,
    date: updatedExpense.date,
    categoryId: updatedExpense.category.id,
    subCategoryId: updatedExpense.subCategory?.id,
    paidBackAmount: updatedExpense.paidBackAmount,
  }

  return await gatewayUpdateExpense(request)
}
