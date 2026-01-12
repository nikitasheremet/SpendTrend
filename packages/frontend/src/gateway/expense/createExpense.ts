import { Expense, NewExpense } from '@/types/expenseData'
import { CreateExpenseResponse } from '@contracts/expense/createExpense'
import { post } from '@gateway/post'
import { createExpenseResponseToDomainExpense } from '../mappers/expense/createExpenseResponseToDomainExpense'
import { apiFailedExpensesToDomain } from '../mappers/expense/failedExpenseApiToDomain'

type CreateExpensesArray = Array<
  Omit<NewExpense, 'category' | 'subCategory'> & { categoryId: string; subCategoryId?: string }
>

export interface CreateExpenseRequest {
  userId: string
  accountId: string
  expensesToCreate: CreateExpensesArray
}

export async function createExpense(expense: CreateExpenseRequest): Promise<{
  createdExpenses: Array<Expense>
  failedExpenses: Array<{ expenseInput: NewExpense; errorMessage: string }>
}> {
  const response = await post<CreateExpenseResponse>('createexpense', expense)
  return {
    createdExpenses: response.createdExpenses.createdExpenses.map((createdExpense) =>
      createExpenseResponseToDomainExpense(createdExpense),
    ),
    failedExpenses: apiFailedExpensesToDomain(response.createdExpenses.failedExpenses),
  }
}
