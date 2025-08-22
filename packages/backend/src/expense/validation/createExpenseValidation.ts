import {
  ValidationError,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
} from '../../models/errors/validationError'
import { CreateExpenseInput } from '../service/createExpenseService'
import {
  validateRequiredUserId,
  validateRequiredAccountId,
  validateRequiredName,
  validateRequiredAmount,
  validateRequiredNetAmount,
  validateRequiredDate,
  validateRequiredCategory,
  validateRequiredSubCategory,
  validateRequiredPaidBackAmount,
} from './validationUtils'

export function validateCreateExpenseInput(input: unknown): asserts input is CreateExpenseInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
  }

  const createExpenseInput = input as Record<string, unknown>

  validateRequiredName(createExpenseInput?.name)
  validateRequiredUserId(createExpenseInput?.userId)
  validateRequiredAccountId(createExpenseInput?.accountId)
  validateRequiredAmount(createExpenseInput?.amount)
  validateRequiredNetAmount(createExpenseInput?.netAmount)
  validateRequiredDate(createExpenseInput?.date)
  validateRequiredCategory(createExpenseInput?.category)
  validateRequiredSubCategory(createExpenseInput?.subCategory)
  validateRequiredPaidBackAmount(createExpenseInput?.paidBackAmount)
}
