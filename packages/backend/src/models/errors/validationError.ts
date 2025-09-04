export const VALIDATION_INPUT_MUST_BE_AN_OBJECT = 'Input must be an object'

export const VALIDATION_ERROR_NETAMOUNT_MISSING = 'Net amount must be present'
export const VALIDATION_ERROR_NETAMOUNT_TYPE = 'Net amount must be a number'
export const VALIDATION_ERROR_NETAMOUNT_NEGATIVE = 'Net amount cannot be negative'
export const VALIDATION_ERROR_CATEGORY_MISSING = 'Category must be provided'
export const VALIDATION_ERROR_CATEGORY_TYPE = 'Category must be a string'
export const VALIDATION_ERROR_CATEGORY_EMPTY = 'Category cannot be an empty string'
export const DATE_REGEX_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/
export const VALIDATION_ERROR_DATE_MISSING = 'Date must be provided'
export const VALIDATION_ERROR_DATE_TYPE = 'Date must be a string'
export const VALIDATION_ERROR_DATE_EMPTY = 'Date cannot be an empty string'
export const VALIDATION_ERROR_DATE_FORMAT = 'Date must follow the pattern YYYY-MM-DD'
export const VALIDATION_ERROR_NAME_IS_REQUIRED = 'Name is required'
export const VALIDATION_ERROR_NAME_MUST_BE_STRING = 'Name must be a string'
export const VALIDATION_ERROR_NAME_EMPTY = 'Name must not be empty'
export const VALIDATION_ERROR_AMOUNT_MISSING = 'Amount must be provided and must be a number'
export const VALIDATION_ERROR_AMOUNT_NEGATIVE = 'Amount cannot be negative'

export const VALIDATION_ERROR_AMOUNT_TYPE = 'Amount must be a number'

export const VALIDATION_ERROR_SUBCATEGORY_MISSING = 'Subcategory must be provided'
export const VALIDATION_ERROR_SUBCATEGORY_TYPE = 'Subcategory must be a string'

export const VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING =
  'Paid back amount must be provided and must be a number'
export const VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE = 'Paid back amount cannot be negative'

export const VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE = 'Paid back amount must be a number'
export const VALIDATION_ERROR_USERID_MISSING = 'User ID must be provided'
export const VALIDATION_ERROR_USERID_TYPE = 'User ID must be uuid'
export const VALIDATION_ERROR_USERID_EMPTY = 'User ID must not be empty'
export const VALIDATION_ERROR_ACCOUNTID_MISSING = 'Account ID must be provided'
export const VALIDATION_ERROR_ACCOUNTID_TYPE = 'Account ID must be a uuid'
export const VALIDATION_ERROR_ACCOUNTID_EMPTY = 'Account ID cannot be an empty string'
export const VALIDATION_ERROR_EXPENSEID_MISSING = 'Expense ID must be provided'
export const VALIDATION_ERROR_EXPENSEID_TYPE = 'Expense ID must be a string'
export const VALIDATION_ERROR_EXPENSEID_EMPTY = 'Expense ID cannot be an empty string'
export const VALIDATION_ERROR_NO_FIELDS_TO_UPDATE = 'No fields provided to update'

export const VALIDATION_ERROR_USERID_INVALID = 'User ID must be a UUID'

export const VALIDATION_ERROR_SUBCATEGORIES_MISSING = 'Subcategories must be provided'
export const VALIDATION_ERROR_SUBCATEGORIES_MUST_BE_ARRAY = 'Subcategories must be an array'
export const VALIDATION_ERROR_SUBCATEGORIES_ITEMS_MUST_BE_STRINGS =
  'Subcategories must contain only strings'

export const VALIDATION_ERROR_EXPENSECATEGORYID_MISSING = 'Expense category ID must be provided'
export const VALIDATION_ERROR_EXPENSECATEGORYID_TYPE = 'Expense category ID must be a uuid'

export const VALIDATION_ERROR_UPDATE_EXPENSECATEGORY_AT_LEAST_ONE_FIELD_REQUIRED =
  "At least one of 'name' or 'subcategories' must be provided"

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
