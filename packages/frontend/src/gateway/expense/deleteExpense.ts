import { Expense } from '@/types/expenseData'
import { DeleteExpenseResponse } from '@contracts/expense/deleteExpense'
import { post } from '@gateway/post'
import { deleteExpenseResponseToDomainExpense } from '../mappers/expense/deleteExpenseResponseToDomainExpense'

export interface DeleteExpenseRequest {
  expenseId: string
  userId: string
  accountId: string
}

export async function deleteExpense(
  expenseId: string,
  userId: string,
  accountId: string,
): Promise<Expense> {
  const request: DeleteExpenseRequest = { expenseId, userId, accountId }
  const response = await post<DeleteExpenseResponse>('deleteexpense', request)
  return deleteExpenseResponseToDomainExpense(response.expense)
}
