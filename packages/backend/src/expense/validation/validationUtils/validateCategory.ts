import {
  VALIDATION_ERROR_CATEGORY_EMPTY,
  VALIDATION_ERROR_CATEGORY_MISSING,
  VALIDATION_ERROR_CATEGORY_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

export function validateRequiredCategory(category: unknown) {
  if (category === undefined) {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_MISSING)
  }
  validateCategory(category)
}

export function validateOptionalCategory(category: unknown) {
  if (category === undefined) return
  validateCategory(category)
}

function validateCategory(category: unknown): void {
  if (typeof category !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_TYPE)
  }
  if (category === '') {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_EMPTY)
  }
}
