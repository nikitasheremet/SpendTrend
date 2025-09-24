import { Expense } from '@/types/expenseData'
import { Expense as ContractExpense } from '@contracts/expense/models'
import { apiExpenseToDomain } from './apiExpenseToDomain'

export function getExpensesResponseToDomainExpenses(
  responseExpenses: ContractExpense[],
): Expense[] {
  return responseExpenses.map(apiExpenseToDomain)
}
