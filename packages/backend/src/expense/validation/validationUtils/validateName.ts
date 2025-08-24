import {
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  ValidationError,
} from '../../../models/errors/validationError'

function validateName(name: unknown) {
  if (typeof name !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_NAME_MUST_BE_STRING)
  }
  if (name.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_NAME_EMPTY)
  }
}

export function validateRequiredName(name: unknown) {
  if (name === undefined) {
    throw new ValidationError(VALIDATION_ERROR_NAME_IS_REQUIRED)
  }
  validateName(name)
}

export function validateOptionalName(name: unknown) {
  if (name !== undefined) {
    validateName(name)
  }
}
