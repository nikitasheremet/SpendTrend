import { validateGetExpensesInput } from '../../validation/getExpensesValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateGetExpensesInput', () => {
  const validInput = {
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should throw a ValidationError for invalid userId', () => {
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

    it('should throw a ValidationError for invalid accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateGetExpensesInput(input)).toThrow(ValidationError)
      expect(() => validateGetExpensesInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })
})
