import { validateCreateExpenseInput } from '../../validation'
import {
  ValidationError,
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_CATEGORY_ID_MISSING,
  VALIDATION_ERROR_CATEGORY_ID_TYPE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_SUBCATEGORY_ID_TYPE,
} from '../../../models/errors/validationError'
import crypto from 'crypto'

describe('validateCreateExpenseInput', () => {
  const validInput = {
    name: 'Lunch',
    amount: 10,
    netAmount: 10,
    date: '2023-01-01',
    categoryId: crypto.randomUUID(),
    subCategoryId: crypto.randomUUID(),
    paidBackAmount: 0,
    userId: crypto.randomUUID(),
    accountId: crypto.randomUUID(),
  }
  describe('when the netAmount field is invalid', () => {
    it('should throw a ValidationError for missing netAmount', () => {
      const input = { ...validInput, netAmount: undefined }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_MISSING)
    })
    it('should throw a ValidationError for non-number netAmount', () => {
      const input = { ...validInput, netAmount: 'not-a-number' }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_TYPE)
    })
    it('should throw a ValidationError for negative netAmount', () => {
      const input = { ...validInput, netAmount: -1 }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_NEGATIVE)
    })
  })
  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })
    it('should throw a ValidationError for invalid userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })
    it('should throw a ValidationError for invalid accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })
  describe('when name field is missing or empty', () => {
    it('should throw a validation error for improper name field', () => {
      // Arrange
      const input = { ...validInput, name: undefined }
      // Act & Assert
      expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_NAME_IS_REQUIRED)
    })
  })

  describe('when the amount field is invalid', () => {
    describe('when amount is missing', () => {
      it('should throw a ValidationError with the correct message for missing amount', () => {
        // Arrange
        const input = { ...validInput, amount: undefined }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_MISSING)
      })
    })
    describe('when amount is negative', () => {
      it('should throw a ValidationError with the correct message for negative amount', () => {
        // Arrange
        const input = { ...validInput, amount: -5 }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_NEGATIVE)
      })
    })
    describe('when amount is not a number', () => {
      it('should throw a ValidationError with the correct message for non-number amount', () => {
        // Arrange
        const input = { ...validInput, amount: 'not-a-number' }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_TYPE)
      })
    })
  })

  describe('when the date field is invalid', () => {
    describe('when date is missing', () => {
      it('should throw a ValidationError with the correct message for missing date', () => {
        // Arrange
        const input = { ...validInput, date: undefined }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_MISSING)
      })
    })
    describe('when date is not a string', () => {
      it('should throw a ValidationError with the correct message for non-string date', () => {
        // Arrange
        const input = { ...validInput, date: 20230728 }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_TYPE)
      })
    })
    describe('when date is an empty string', () => {
      it('should throw a ValidationError with the correct message for empty date', () => {
        // Arrange
        const input = { ...validInput, date: '' }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_EMPTY)
      })
    })
    describe('when date does not match YYYY-MM-DD', () => {
      it('should throw a ValidationError with the correct message for invalid date format', () => {
        // Arrange
        const input = { ...validInput, date: '07-28-2025' }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_FORMAT)
      })
    })
  })
  describe('when the categoryId field is invalid', () => {
    describe('when category is missing', () => {
      it('should throw a ValidationError with the correct message for missing categoryId', () => {
        // Arrange
        const input = { ...validInput, categoryId: undefined }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(
          VALIDATION_ERROR_CATEGORY_ID_MISSING,
        )
      })
    })
    describe('when categoryId is not a valid uuid', () => {
      it('should throw a ValidationError with the correct message for non-uuid categoryId', () => {
        // Arrange
        const input = { ...validInput, categoryId: 123 }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(VALIDATION_ERROR_CATEGORY_ID_TYPE)
      })
    })
  })

  describe('when the subCategoryId field is provided but invalid ', () => {
    describe('when subCategoryId is not a valid uuid', () => {
      it('should throw a ValidationError ', () => {
        // Arrange
        const input = { ...validInput, subCategoryId: 123 }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(
          VALIDATION_ERROR_SUBCATEGORY_ID_TYPE,
        )
      })
    })
  })

  describe('when the paidBackAmount field is invalid', () => {
    describe('when paidBackAmount is missing', () => {
      it('should throw a ValidationError with the correct message for missing paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: undefined }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(
          VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
        )
      })
    })
    describe('when paidBackAmount is negative', () => {
      it('should throw a ValidationError with the correct message for negative paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: -5 }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(
          VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
        )
      })
    })
    describe('when paidBackAmount is not a number', () => {
      it('should throw a ValidationError with the correct message for non-number paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: 'not-a-number' }
        // Act & Assert
        expect(() => validateCreateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateCreateExpenseInput(input)).toThrow(
          VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
        )
      })
    })
  })
})
