import {
  ValidationError,
  VALIDATION_ERROR_NAME,
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NAN,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  DATE_REGEX_YYYY_MM_DD,
  VALIDATION_ERROR_CATEGORY_MISSING,
  VALIDATION_ERROR_CATEGORY_TYPE,
  VALIDATION_ERROR_CATEGORY_EMPTY,
  VALIDATION_ERROR_SUBCATEGORY_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_TYPE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NAN,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_NAN,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
} from '../../models/errors/validationError'
import { CreateExpenseInput } from '../service/createExpenseService'
import { validateUserId, validateAccountId } from './validationUtils'

export function validateCreateExpenseInput(input: unknown): asserts input is CreateExpenseInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
  }

  const createExpenseInput = input as Record<string, unknown>

  validateName(createExpenseInput?.name)
  validateUserId(createExpenseInput?.userId)
  validateAccountId(createExpenseInput?.accountId)
  validateAmount(createExpenseInput?.amount)
  validateNetAmount(createExpenseInput?.netAmount)
  validateDate(createExpenseInput?.date)
  validateCategory(createExpenseInput?.category)
  validateSubCategory(createExpenseInput?.subCategory)
  validatePaidBackAmount(createExpenseInput?.paidBackAmount)
}

function validateNetAmount(netAmount: unknown) {
  if (netAmount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_MISSING)
  }
  if (typeof netAmount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_TYPE)
  }
  if (isNaN(netAmount)) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_NAN)
  }
  if (netAmount < 0) {
    throw new ValidationError(VALIDATION_ERROR_NETAMOUNT_NEGATIVE)
  }
}

function validateName(name: unknown) {
  if (!name || typeof name !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_NAME)
  }
}

function validateAmount(amount: unknown) {
  if (amount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_MISSING)
  }
  if (typeof amount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_TYPE)
  }
  if (isNaN(amount)) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_NAN)
  }
  if (amount < 0) {
    throw new ValidationError(VALIDATION_ERROR_AMOUNT_NEGATIVE)
  }
}

function validateDate(date: unknown) {
  if (date === undefined) {
    throw new ValidationError(VALIDATION_ERROR_DATE_MISSING)
  }
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

function validateCategory(category: unknown) {
  if (category === undefined) {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_MISSING)
  }
  if (typeof category !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_TYPE)
  }
  if (category === '') {
    throw new ValidationError(VALIDATION_ERROR_CATEGORY_EMPTY)
  }
}

function validateSubCategory(subCategory: unknown) {
  if (subCategory === undefined) {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_MISSING)
  }
  if (typeof subCategory !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_TYPE)
  }
}

function validatePaidBackAmount(paidBackAmount: unknown) {
  if (paidBackAmount === undefined) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING)
  }
  if (typeof paidBackAmount !== 'number') {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE)
  }
  if (isNaN(paidBackAmount)) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_NAN)
  }
  if (paidBackAmount < 0) {
    throw new ValidationError(VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE)
  }
}
