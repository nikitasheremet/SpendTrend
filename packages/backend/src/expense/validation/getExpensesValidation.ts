import {
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
  ValidationError,
} from '../../models/errors/validationError'
import { validateRequiredUserId, validateRequiredAccountId } from './validationUtils/'

export interface GetExpensesInput {
  userId: string
  accountId: string
}

export function validateGetExpensesInput(input: unknown): asserts input is GetExpensesInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
  }

  const getExpensesInput = input as Record<string, unknown>

  validateRequiredUserId(getExpensesInput?.userId)
  validateRequiredAccountId(getExpensesInput?.accountId)
}
