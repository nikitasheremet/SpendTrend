import {
  VALIDATION_ERROR_USERID_EMPTY,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredUserId(userId: unknown): void {
  if (userId === undefined || userId === null) {
    throw new ValidationError(VALIDATION_ERROR_USERID_MISSING)
  }
  validateUserId(userId)
}

function validateUserId(userId: unknown): void {
  if (typeof userId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_USERID_TYPE)
  }
  if (userId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_USERID_EMPTY)
  }
}
