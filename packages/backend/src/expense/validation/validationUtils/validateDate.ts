import {
  DATE_REGEX_YYYY_MM_DD,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredDate(date: unknown) {
  if (date === undefined) {
    throw new ValidationError(VALIDATION_ERROR_DATE_MISSING)
  }
  validateDate(date)
}

export function validateOptionalDate(date: unknown) {
  if (date === undefined) return
  validateDate(date)
}

function validateDate(date: unknown): void {
  if (typeof date !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_DATE_TYPE)
  }
  if (date === '') {
    throw new ValidationError(VALIDATION_ERROR_DATE_EMPTY)
  }
  if (!DATE_REGEX_YYYY_MM_DD.test(date)) {
    throw new ValidationError(VALIDATION_ERROR_DATE_FORMAT)
  }
}
