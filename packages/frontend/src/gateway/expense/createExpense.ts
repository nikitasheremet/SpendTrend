import { Expense, NewExpense } from '@/types/expenseData'
import { CreateExpenseResponse } from '@contracts/expense/createExpense'
import { post } from '@gateway/post'
import { createExpenseResponseToDomainExpense } from '../mappers/expense/createExpenseResponseToDomainExpense'

export interface CreateExpenseRequest extends Omit<NewExpense, 'category' | 'subCategory'> {
  userId: string
  accountId: string
  categoryId: string
  subCategoryId?: string
}

export async function createExpense(expense: CreateExpenseRequest): Promise<Expense> {
  const response = await post<CreateExpenseResponse>('createexpense', expense)
  return createExpenseResponseToDomainExpense(response.createdExpense)
}
