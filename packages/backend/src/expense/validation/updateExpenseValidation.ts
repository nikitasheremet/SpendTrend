import {
  VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
  ValidationError,
} from '../../models/errors/validationError'
import { UpdateExpenseInput } from '../service/models'
import {
  validateRequiredId,
  validateOptionalName,
  validateOptionalAmount,
  validateOptionalNetAmount,
  validateOptionalDate,
  validateOptionalCategory,
  validateOptionalSubCategory,
  validateOptionalPaidBackAmount,
} from './validationUtils'

export function validateUpdateExpenseInput(input: unknown): asserts input is UpdateExpenseInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
  }

  const updatedExpenseInput = input as Record<string, unknown>

  if (
    updatedExpenseInput?.name === undefined &&
    updatedExpenseInput?.amount === undefined &&
    updatedExpenseInput?.netAmount === undefined &&
    updatedExpenseInput?.date === undefined &&
    updatedExpenseInput?.category === undefined &&
    updatedExpenseInput?.subCategory === undefined &&
    updatedExpenseInput?.paidBackAmount === undefined
  ) {
    throw new ValidationError(VALIDATION_ERROR_NO_FIELDS_TO_UPDATE)
  }

  validateRequiredId(updatedExpenseInput?.id)
  validateOptionalName(updatedExpenseInput?.name)
  validateOptionalAmount(updatedExpenseInput?.amount)
  validateOptionalNetAmount(updatedExpenseInput?.netAmount)
  validateOptionalDate(updatedExpenseInput?.date)
  validateOptionalCategory(updatedExpenseInput?.category)
  validateOptionalSubCategory(updatedExpenseInput?.subCategory)
  validateOptionalPaidBackAmount(updatedExpenseInput?.paidBackAmount)
}
