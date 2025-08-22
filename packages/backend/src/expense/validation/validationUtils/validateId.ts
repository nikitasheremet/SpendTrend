import {
  VALIDATION_ERROR_EXPENSEID_EMPTY,
  VALIDATION_ERROR_EXPENSEID_MISSING,
  VALIDATION_ERROR_EXPENSEID_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredId(expenseId: unknown): void {
  if (expenseId === undefined || expenseId === null) {
    throw new ValidationError(VALIDATION_ERROR_EXPENSEID_MISSING)
  }
  validateId(expenseId)
}

function validateId(expenseId: unknown): void {
  if (typeof expenseId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_EXPENSEID_TYPE)
  }

  if (expenseId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_EXPENSEID_EMPTY)
  }
}
