import { validateDeleteExpenseInput } from '../../validation/deleteExpenseValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_USERID_EMPTY,
  VALIDATION_ERROR_ACCOUNTID_EMPTY,
  VALIDATION_ERROR_EXPENSEID_TYPE,
  VALIDATION_ERROR_EXPENSEID_MISSING,
  VALIDATION_ERROR_EXPENSEID_EMPTY,
} from '../../../models/errors/validationError'

describe('validateDeleteExpensesInput', () => {
  const validInput = {
    userId: 'user-123',
    accountId: 'account-456',
    expenseId: 'expense-789',
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should throw a ValidationError for empty userId', () => {
      const input = { ...validInput, userId: '' }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_EMPTY)
    })

    it('should throw a ValidationError for non-string userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })

    it('should throw a ValidationError for empty accountId', () => {
      const input = { ...validInput, accountId: '' }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_EMPTY)
    })

    it('should throw a ValidationError for non-string accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })

  describe('when the expenseId field is invalid', () => {
    it('should throw a ValidationError for missing expenseId', () => {
      const input = { ...validInput, expenseId: undefined }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_EXPENSEID_MISSING)
    })

    it('should throw a ValidationError for empty expenseId', () => {
      const input = { ...validInput, expenseId: '' }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_EXPENSEID_EMPTY)
    })

    it('should throw a ValidationError for non-string expenseId', () => {
      const input = { ...validInput, expenseId: 123 }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_EXPENSEID_TYPE)
    })
  })
})
