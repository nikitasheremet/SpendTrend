import {
  ValidationError,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'

export function validateRequiredAccountId(accountId: unknown): void {
  if (accountId === undefined) {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
  validateAccountId(accountId)
}

function validateAccountId(accountId: unknown): void {
  if (typeof accountId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE)
  }
  if (accountId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
}
