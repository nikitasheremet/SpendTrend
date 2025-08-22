import {
  VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NAN,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

function validatePaidBackAmount(paidBackAmount: unknown) {
  if (typeof paidBackAmount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE)
  }
  if (isNaN(paidBackAmount)) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_NAN)
  }
  if ((paidBackAmount as number) < 0) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE)
  }
}
export function validateRequiredPaidBackAmount(paidBackAmount: unknown) {
  if (paidBackAmount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING)
  }
  validatePaidBackAmount(paidBackAmount)
}
export function validateOptionalPaidBackAmount(paidBackAmount: unknown) {
  if (paidBackAmount === undefined) return
  validatePaidBackAmount(paidBackAmount)
}
