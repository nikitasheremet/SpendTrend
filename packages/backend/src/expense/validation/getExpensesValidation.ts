import { validateUserId, validateAccountId } from './validationUtils'

export interface GetExpensesInput {
  userId: string
  accountId: string
}

export function validateGetExpensesInput(input: unknown): asserts input is GetExpensesInput {
  const getExpensesInput = input as Record<string, unknown>
  validateUserId(getExpensesInput?.userId)
  validateAccountId(getExpensesInput?.accountId)
}
