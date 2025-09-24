import { Expense } from '@/types/expenseData'
import { GetExpensesResponse } from '@contracts/expense/getExpenses'
import { get } from '@gateway/get'
import { getExpensesResponseToDomainExpenses } from '../mappers/expense/getExpensesResponseToDomainExpenses'

export interface GetExpensesRequest {
  userId: string
  accountId: string
}

export async function getExpensesGateway(request: GetExpensesRequest): Promise<Expense[]> {
  const response = await get<GetExpensesResponse>('expenses', {
    userId: request.userId,
    accountId: request.accountId,
  })
  return getExpensesResponseToDomainExpenses(response.expenses)
}
