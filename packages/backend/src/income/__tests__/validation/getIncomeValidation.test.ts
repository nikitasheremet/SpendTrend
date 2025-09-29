import { validateGetIncomeInput } from '../../validation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateGetIncomeInput', () => {
  const validInput = {
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateGetIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_USERID_MISSING))
    })

    it('should throw a ValidationError for invalid userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateGetIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_USERID_TYPE))
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateGetIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING))
    })

    it('should throw a ValidationError for invalid accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateGetIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE))
    })
  })

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      expect(() => validateGetIncomeInput(validInput)).not.toThrow()
    })
  })
})