import { Expense } from '@/types/expenseData'
import { Expense as ResponseExpense } from '@contracts/expense/models'
import { apiExpenseToDomain } from './apiExpenseToDomain'

export function createExpenseResponseToDomainExpense(response: ResponseExpense): Expense {
  return apiExpenseToDomain(response)
}
