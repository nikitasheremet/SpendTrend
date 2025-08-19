export const VALIDATION_INPUT_MUST_BE_AN_OBJECT = 'Input must be an object'

export const VALIDATION_ERROR_NETAMOUNT_MISSING = 'Net amount must be present'
export const VALIDATION_ERROR_NETAMOUNT_TYPE = 'Net amount must be a number'
export const VALIDATION_ERROR_NETAMOUNT_NAN = 'Net amount must be a valid number'
export const VALIDATION_ERROR_NETAMOUNT_NEGATIVE = 'Net amount cannot be negative'
export const VALIDATION_ERROR_CATEGORY_MISSING = 'Category must be provided'
export const VALIDATION_ERROR_CATEGORY_TYPE = 'Category must be a string'
export const VALIDATION_ERROR_CATEGORY_EMPTY = 'Category cannot be an empty string'
export const DATE_REGEX_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/
export const VALIDATION_ERROR_DATE_MISSING = 'Date must be provided'
export const VALIDATION_ERROR_DATE_TYPE = 'Date must be a string'
export const VALIDATION_ERROR_DATE_EMPTY = 'Date cannot be an empty string'
export const VALIDATION_ERROR_DATE_FORMAT = 'Date must follow the pattern YYYY-MM-DD'
export const VALIDATION_ERROR_NAME = 'Name must be provided and must be a string'
export const VALIDATION_ERROR_AMOUNT_MISSING = 'Amount must be provided and must be a number'
export const VALIDATION_ERROR_AMOUNT_NAN = 'Amount must be a valid number'
export const VALIDATION_ERROR_AMOUNT_NEGATIVE = 'Amount cannot be negative'

export const VALIDATION_ERROR_AMOUNT_TYPE = 'Amount must be a number'

export const VALIDATION_ERROR_SUBCATEGORY_MISSING = 'Subcategory must be provided'
export const VALIDATION_ERROR_SUBCATEGORY_TYPE = 'Subcategory must be a string'

export const VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING =
  'Paid back amount must be provided and must be a number'
export const VALIDATION_ERROR_PAIDBACKAMOUNT_NAN = 'Paid back amount must be a valid number'
export const VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE = 'Paid back amount cannot be negative'

export const VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE = 'Paid back amount must be a number'
export const VALIDATION_ERROR_USERID_MISSING = 'User ID must be provided'
export const VALIDATION_ERROR_USERID_TYPE = 'User ID must be a string'
export const VALIDATION_ERROR_ACCOUNTID_MISSING = 'Account ID must be provided'
export const VALIDATION_ERROR_ACCOUNTID_TYPE = 'Account ID must be a string'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
