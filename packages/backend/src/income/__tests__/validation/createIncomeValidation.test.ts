import { validateCreateIncomeInput } from '../../validation'
import {
  ValidationError,
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateCreateIncomeInput', () => {
  const validInput = {
    name: 'Lunch',
    amount: 10,
    date: '2023-01-01',
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
  }
  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_USERID_MISSING))
    })
    it('should throw a ValidationError for invalid userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_USERID_TYPE))
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING))
    })
    it('should throw a ValidationError for invalid accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE))
    })
  })
  describe('if name is invalid', () => {
    describe('when name is missing', () => {
      it('should throw a ValidationError for missing name', () => {
        const input = { ...validInput, name: undefined }
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_NAME_IS_REQUIRED))
      })
    })

    describe('when name is a non-string', () => {
      it('should throw a ValidationError for non-string name', () => {
        const input = { ...validInput, name: 123 }
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_NAME_MUST_BE_STRING))
      })
    })

    describe('when name is an empty string', () => {
      it('should throw a ValidationError for empty name', () => {
        const input = { ...validInput, name: '' }
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_NAME_EMPTY))
      })
    })
  })

  describe('when the amount field is invalid', () => {
    describe('when amount is missing', () => {
      it('should throw a ValidationError with the correct message for missing amount', () => {
        // Arrange
        const input = { ...validInput, amount: undefined }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_AMOUNT_MISSING))
      })
    })
    describe('when amount is negative', () => {
      it('should throw a ValidationError with the correct message for negative amount', () => {
        // Arrange
        const input = { ...validInput, amount: -5 }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_AMOUNT_NEGATIVE))
      })
    })
    describe('when amount is not a number', () => {
      it('should throw a ValidationError with the correct message for non-number amount', () => {
        // Arrange
        const input = { ...validInput, amount: 'not-a-number' }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_AMOUNT_TYPE))
      })
    })
  })

  describe('when the date field is invalid', () => {
    describe('when date is missing', () => {
      it('should throw a ValidationError with the correct message for missing date', () => {
        // Arrange
        const input = { ...validInput, date: undefined }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_DATE_MISSING))
      })
    })
    describe('when date is not a string', () => {
      it('should throw a ValidationError with the correct message for non-string date', () => {
        // Arrange
        const input = { ...validInput, date: 20230728 }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_DATE_TYPE))
      })
    })
    describe('when date is an empty string', () => {
      it('should throw a ValidationError with the correct message for empty date', () => {
        // Arrange
        const input = { ...validInput, date: '' }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_DATE_EMPTY))
      })
    })
    describe('when date does not match YYYY-MM-DD', () => {
      it('should throw a ValidationError with the correct message for invalid date format', () => {
        // Arrange
        const input = { ...validInput, date: '07-28-2025' }
        // Act & Assert
        expect(() => validateCreateIncomeInput(input)).toThrow(new ValidationError(VALIDATION_ERROR_DATE_FORMAT))
      })
    })
  })

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      expect(() => validateCreateIncomeInput(validInput)).not.toThrow()
    })
  })
})
