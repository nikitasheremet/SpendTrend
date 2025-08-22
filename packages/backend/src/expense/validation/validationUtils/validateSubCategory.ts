import {
  VALIDATION_ERROR_SUBCATEGORY_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

function validateSubCategory(subCategory: unknown) {
  if (typeof subCategory !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_TYPE)
  }
}

export function validateRequiredSubCategory(subCategory: unknown) {
  if (subCategory === undefined) {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_MISSING)
  }
  validateSubCategory(subCategory)
}

export function validateOptionalSubCategory(subCategory: unknown) {
  if (subCategory === undefined) return
  validateSubCategory(subCategory)
}
