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
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_NAN,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
} from '../models/errors/validationError'
import { CreateExpenseInput } from './service'

export function validateExpenseInput(input: any): asserts input is CreateExpenseInput {
  validateName(input?.name)
  validateUserId(input?.userId)
  validateAccountId(input?.accountId)
  validateAmount(input?.amount)
  validateNetAmount(input?.netAmount)
  validateDate(input?.date)
  validateCategory(input?.category)
  validateSubCategory(input?.subCategory)
  validatePaidBackAmount(input?.paidBackAmount)
}

function validateNetAmount(netAmount: any) {
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

function validateName(name: any) {
  if (!name || typeof name !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_NAME)
  }
}

function validateUserId(userId: any) {
  if (userId === undefined) {
    throw new ValidationError(VALIDATION_ERROR_USERID_MISSING)
  }
  if (typeof userId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_USERID_TYPE)
  }
  if (userId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_USERID_MISSING)
  }
}

function validateAccountId(accountId: any) {
  if (accountId === undefined) {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
  if (typeof accountId !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE)
  }
  if (accountId.trim() === '') {
    throw new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING)
  }
}

function validateAmount(amount: any) {
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

function validateDate(date: any) {
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

function validateCategory(category: any) {
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

function validateSubCategory(subCategory: any) {
  if (subCategory === undefined) {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_MISSING)
  }
  if (typeof subCategory !== 'string') {
    throw new ValidationError(VALIDATION_ERROR_SUBCATEGORY_TYPE)
  }
}

function validatePaidBackAmount(paidBackAmount: any) {
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
