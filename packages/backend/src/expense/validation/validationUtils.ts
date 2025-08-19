import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../models/errors/validationError'

export function validateUserId(userId: unknown) {
  if (userId === undefined) {
    throw new ValidationError(VALIDATION_ERROR_USERID_MISSING)
  }
  if (typeof userId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_USERID_TYPE)
  }
  if (userId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_USERID_MISSING)
  }
}

export function validateAccountId(accountId: unknown) {
  if (accountId === undefined) {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
  if (typeof accountId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE)
  }
  if (accountId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
}
