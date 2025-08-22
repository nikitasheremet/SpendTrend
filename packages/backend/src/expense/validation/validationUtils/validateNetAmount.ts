import {
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_NAN,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredNetAmount(netAmount: unknown) {
  if (netAmount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_MISSING)
  }
  validateNetAmount(netAmount)
}

export function validateOptionalNetAmount(netAmount: unknown) {
  if (netAmount === undefined) return
  validateNetAmount(netAmount)
}

function validateNetAmount(netAmount: unknown): void {
  if (typeof netAmount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_TYPE)
  }
  if (isNaN(netAmount)) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_NAN)
  }
  if ((netAmount as number) < 0) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_NEGATIVE)
  }
}
