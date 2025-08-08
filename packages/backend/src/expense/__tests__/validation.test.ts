import { validateExpenseInput } from '../validation'
import {
  ValidationError,
  VALIDATION_ERROR_NAME,
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NAN,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_CATEGORY_MISSING,
  VALIDATION_ERROR_CATEGORY_TYPE,
  VALIDATION_ERROR_CATEGORY_EMPTY,
  VALIDATION_ERROR_SUBCATEGORY_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_TYPE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NAN,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_NAN,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
} from '../../models/errors/validationError'

describe('validateExpenseInput', () => {
  const validInput = {
    name: 'Lunch',
    amount: 10,
    netAmount: 10,
    date: '2023-01-01',
    category: 'Food',
    subCategory: 'Dining',
    paidBackAmount: 0,
    userId: 'user-123',
    accountId: 'account-456',
  }
  describe('when the netAmount field is invalid', () => {
    it('should throw a ValidationError for missing netAmount', () => {
      const input = { ...validInput, netAmount: undefined }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_MISSING)
    })
    it('should throw a ValidationError for non-number netAmount', () => {
      const input = { ...validInput, netAmount: 'not-a-number' }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_TYPE)
    })
    it('should throw a ValidationError for NaN netAmount', () => {
      const input = { ...validInput, netAmount: NaN }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_NAN)
    })
    it('should throw a ValidationError for negative netAmount', () => {
      const input = { ...validInput, netAmount: -1 }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_NETAMOUNT_NEGATIVE)
    })
  })
  describe('when the userId field is invalid', () => {
    it('should throw a ValidationError for missing userId', () => {
      const input = { ...validInput, userId: undefined }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })
    it('should throw a ValidationError for empty userId', () => {
      const input = { ...validInput, userId: '' }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })
    it('should throw a ValidationError for non-string userId', () => {
      const input = { ...validInput, userId: 123 }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when the accountId field is invalid', () => {
    it('should throw a ValidationError for missing accountId', () => {
      const input = { ...validInput, accountId: undefined }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })
    it('should throw a ValidationError for empty accountId', () => {
      const input = { ...validInput, accountId: '' }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })
    it('should throw a ValidationError for non-string accountId', () => {
      const input = { ...validInput, accountId: 123 }
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })
  describe('when name field is missing or empty', () => {
    it('should throw a validation error for improper name field', () => {
      // Arrange
      const input = { ...validInput, name: undefined }
      // Act & Assert
      expect(() => validateExpenseInput(input)).toThrow(ValidationError)
      expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_NAME)
    })
  })

  describe('when the amount field is invalid', () => {
    describe('when amount is missing', () => {
      it('should throw a ValidationError with the correct message for missing amount', () => {
        // Arrange
        const input = { ...validInput, amount: undefined }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_MISSING)
      })
    })
    describe('when amount is NaN', () => {
      it('should throw a ValidationError with the correct message for NaN amount', () => {
        // Arrange
        const input = { ...validInput, amount: NaN }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_NAN)
      })
    })
    describe('when amount is negative', () => {
      it('should throw a ValidationError with the correct message for negative amount', () => {
        // Arrange
        const input = { ...validInput, amount: -5 }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_NEGATIVE)
      })
    })
    describe('when amount is not a number', () => {
      it('should throw a ValidationError with the correct message for non-number amount', () => {
        // Arrange
        const input = { ...validInput, amount: 'not-a-number' }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_AMOUNT_TYPE)
      })
    })
  })

  describe('when the date field is invalid', () => {
    describe('when date is missing', () => {
      it('should throw a ValidationError with the correct message for missing date', () => {
        // Arrange
        const input = { ...validInput, date: undefined }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_MISSING)
      })
    })
    describe('when date is not a string', () => {
      it('should throw a ValidationError with the correct message for non-string date', () => {
        // Arrange
        const input = { ...validInput, date: 20230728 }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_TYPE)
      })
    })
    describe('when date is an empty string', () => {
      it('should throw a ValidationError with the correct message for empty date', () => {
        // Arrange
        const input = { ...validInput, date: '' }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_EMPTY)
      })
    })
    describe('when date does not match YYYY-MM-DD', () => {
      it('should throw a ValidationError with the correct message for invalid date format', () => {
        // Arrange
        const input = { ...validInput, date: '07-28-2025' }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_DATE_FORMAT)
      })
    })
  })
  describe('when the category field is invalid', () => {
    describe('when category is missing', () => {
      it('should throw a ValidationError with the correct message for missing category', () => {
        // Arrange
        const input = { ...validInput, category: undefined }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_CATEGORY_MISSING)
      })
    })
    describe('when category is not a string', () => {
      it('should throw a ValidationError with the correct message for non-string category', () => {
        // Arrange
        const input = { ...validInput, category: 123 }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_CATEGORY_TYPE)
      })
    })
    describe('when category is an empty string', () => {
      it('should throw a ValidationError with the correct message for empty category', () => {
        // Arrange
        const input = { ...validInput, category: '' }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_CATEGORY_EMPTY)
      })
    })
  })

  describe('when the subCategory field is invalid', () => {
    describe('when subCategory is missing', () => {
      it('should throw a ValidationError with the correct message for missing subCategory', () => {
        // Arrange
        const input = { ...validInput, subCategory: undefined }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_SUBCATEGORY_MISSING)
      })
    })
    describe('when subCategory is not a string', () => {
      it('should throw a ValidationError with the correct message for non-string subCategory', () => {
        // Arrange
        const input = { ...validInput, subCategory: 123 }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_SUBCATEGORY_TYPE)
      })
    })
  })

  describe('when the paidBackAmount field is invalid', () => {
    describe('when paidBackAmount is missing', () => {
      it('should throw a ValidationError with the correct message for missing paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: undefined }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING)
      })
    })
    describe('when paidBackAmount is NaN', () => {
      it('should throw a ValidationError with the correct message for NaN paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: NaN }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_PAIDBACKAMOUNT_NAN)
      })
    })
    describe('when paidBackAmount is negative', () => {
      it('should throw a ValidationError with the correct message for negative paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: -5 }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE)
      })
    })
    describe('when paidBackAmount is not a number', () => {
      it('should throw a ValidationError with the correct message for non-number paidBackAmount', () => {
        // Arrange
        const input = { ...validInput, paidBackAmount: 'not-a-number' }
        // Act & Assert
        expect(() => validateExpenseInput(input)).toThrow(ValidationError)
        expect(() => validateExpenseInput(input)).toThrow(VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE)
      })
    })
  })
})
