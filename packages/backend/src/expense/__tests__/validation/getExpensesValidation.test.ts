import { validateGetExpensesInput } from '../../validation/getExpensesValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_USERID_EMPTY,
  VALIDATION_ERROR_ACCOUNTID_EMPTY,
} from '../../../models/errors/validationError'

describe('validateGetExpensesInput', () => {
  const validInput = {
    userId: 'user-123',
    accountId: 'account-456',
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should throw a ValidationError for empty userId', () => {
      const input = { ...validInput, userId: '' }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_USERID_EMPTY)
    })

    it('should throw a ValidationError for non-string userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })

    it('should throw a ValidationError for empty accountId', () => {
      const input = { ...validInput, accountId: '' }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_EMPTY)
    })

    it('should throw a ValidationError for non-string accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })
})
