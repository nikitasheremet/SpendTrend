import { validateDeleteExpenseInput } from '../../validation/deleteExpenseValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_EXPENSEID_TYPE,
  VALIDATION_ERROR_EXPENSEID_MISSING,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateDeleteExpensesInput', () => {
  const validInput = {
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
    expenseId: crypto.randomUUID(),
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should throw a ValidationError for invalid userId', () => {
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

    it('should throw a ValidationError for invalid accountId', () => {
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

    it('should throw a ValidationError for invalid expenseId', () => {
      const input = { ...validInput, expenseId: 123 }
      expect(() => validateDeleteExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteExpenseInput(input)).toThrow(VALIDATION_ERROR_EXPENSEID_TYPE)
    })
  })
})
