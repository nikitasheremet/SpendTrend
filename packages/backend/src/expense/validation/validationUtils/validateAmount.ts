import {
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NAN,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_AMOUNT_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredAmount(amount: unknown) {
  if (amount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_MISSING)
  }
  validateAmount(amount)
}

export function validateOptionalAmount(amount: unknown) {
  if (amount === undefined) return
  validateAmount(amount)
}

function validateAmount(amount: unknown): void {
  if (typeof amount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_TYPE)
  }
  if (isNaN(amount)) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_NAN)
  }
  if ((amount as number) < 0) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_NEGATIVE)
  }
}
