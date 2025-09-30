import { validateDeleteIncomeInput } from '../../validation/deleteIncomeValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_INCOMEID_TYPE,
  VALIDATION_ERROR_INCOMEID_MISSING,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateDeleteIncomeInput', () => {
  const validInput = {
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
    id: crypto.randomUUID(),
  }

  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should throw a ValidationError for invalid userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })

    it('should throw a ValidationError for invalid accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })

  describe('when the id field is invalid', () => {
    it('should throw a ValidationError for missing id', () => {
      const input = { ...validInput, id: undefined }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_INCOMEID_MISSING)
    })

    it('should throw a ValidationError for invalid id', () => {
      const input = { ...validInput, id: 123 }
      expect(() => validateDeleteIncomeInput(input)).toThrow(ValidationError)
      expect(() => validateDeleteIncomeInput(input)).toThrow(VALIDATION_ERROR_INCOMEID_TYPE)
    })
  })
})
