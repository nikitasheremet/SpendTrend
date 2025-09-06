import { validateUpdateExpenseInput } from '../../validation/updateExpenseValidation'
import {
  ValidationError,
  VALIDATION_ERROR_EXPENSEID_MISSING,
  VALIDATION_ERROR_EXPENSEID_TYPE,
  VALIDATION_ERROR_EXPENSEID_EMPTY,
  VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_SUBCATEGORY_TYPE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
  VALIDATION_ERROR_CATEGORY_ID_TYPE,
} from '../../../models/errors/validationError'

describe('validateUpdateExpenseInput', () => {
  const fakeValidInput = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Groceries',
    amount: 100,
    netAmount: 90,
    date: '2025-08-22',
    categoryId: '123e4567-e89b-12d3-a456-426614174001',
    subCategory: 'Groceries',
    paidBackAmount: 0,
  }

  describe('when id is invalid', () => {
    it('should throw an error if id is missing', () => {
      const fakeInvalidInput = { name: fakeValidInput.name }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_EXPENSEID_MISSING,
      )
    })

    it('should throw an error if id is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, id: 123 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_EXPENSEID_TYPE,
      )
    })

    it('should throw an error if id is an empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, id: '' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_EXPENSEID_EMPTY,
      )
    })
  })

  describe('when "name" is present and is invalid', () => {
    it('should throw an error if name is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: 123 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NAME_MUST_BE_STRING,
      )
    })

    it('should throw an error if name is an empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: '' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NAME_EMPTY,
      )
    })
  })

  describe('when "amount" is present and is invalid', () => {
    it('should throw an error if amount is not a number', () => {
      const fakeInvalidInput = { ...fakeValidInput, amount: '123' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_AMOUNT_TYPE,
      )
    })

    it('should throw an error if amount is negative', () => {
      const fakeInvalidInput = { ...fakeValidInput, amount: -1 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_AMOUNT_NEGATIVE,
      )
    })
  })

  describe('when "netAmount" is present and is invalid', () => {
    it('should throw an error if netAmount is not a number', () => {
      const fakeInvalidInput = { ...fakeValidInput, netAmount: '123' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NETAMOUNT_TYPE,
      )
    })

    it('should throw an error if netAmount is negative', () => {
      const fakeInvalidInput = { ...fakeValidInput, netAmount: -5 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
      )
    })
  })

  describe('when "date" is present and is invalid', () => {
    it('should throw an error if date is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, date: 20200101 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(VALIDATION_ERROR_DATE_TYPE)
    })

    it('should throw an error if date is an empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, date: '' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_DATE_EMPTY,
      )
    })
  })

  describe('when "categoryId" is present and is invalid', () => {
    it('should throw an error if categoryId is not a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, categoryId: 123 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_CATEGORY_ID_TYPE,
      )
    })
  })

  describe('when "subCategory" is present and is invalid', () => {
    it('should throw an error if subCategory is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, subCategory: 123 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_SUBCATEGORY_TYPE,
      )
    })
  })

  describe('when "paidBackAmount" is present and is invalid', () => {
    it('should throw an error if paidBackAmount is not a number', () => {
      const fakeInvalidInput = { ...fakeValidInput, paidBackAmount: 'not-a-number' }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
      )
    })

    it('should throw an error if paidBackAmount is negative', () => {
      const fakeInvalidInput = { ...fakeValidInput, paidBackAmount: -1 }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
      )
    })
  })

  describe('when all fields are present and valid', () => {
    it('should not throw an error', () => {
      expect(() => validateUpdateExpenseInput(fakeValidInput)).not.toThrow()
    })
  })
  describe('when no updateable fields are present', () => {
    it('should throw no updatabled field error', () => {
      const fakeInvalidInput = { id: fakeValidInput.id }
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateExpenseInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
      )
    })
  })
})
