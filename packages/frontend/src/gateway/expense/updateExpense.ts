import { Expense } from '@/types/expenseData'
import { UpdateExpenseResponse } from '@contracts/expense/updateExpense'
import { put } from '@gateway/put'
import { updateExpenseResponseToDomainExpense } from '../mappers/expense/updateExpenseResponseToDomainExpense'

export interface UpdateExpenseRequest {
  id: string
  userId: string
  accountId: string
  name?: string
  amount?: number
  netAmount?: number
  date?: string
  categoryId?: string
  subCategoryId?: string
  paidBackAmount?: number
}

export async function updateExpense(request: UpdateExpenseRequest): Promise<Expense> {
  const response = await put<UpdateExpenseResponse>('updateexpense', request)
  return updateExpenseResponseToDomainExpense(response.updatedExpense)
}
