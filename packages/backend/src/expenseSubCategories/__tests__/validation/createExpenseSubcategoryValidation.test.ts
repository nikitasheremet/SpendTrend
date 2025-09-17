import { validateCreateExpenseSubCategoryInput } from '../../validation/createExpenseSubCategoryValidation'
import {
  ValidationError,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_CATEGORY_ID_MISSING,
  VALIDATION_ERROR_CATEGORY_ID_TYPE,
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
} from '../../../models/errors/validationError'

describe('validateCreateExpenseSubCategoryInput', () => {
  const validInput = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
  }

  describe('when input is not an object', () => {
    it('should throw a validation error', () => {
      expect(() => validateCreateExpenseSubCategoryInput('not an object')).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput('not an object')).toThrow(
        VALIDATION_INPUT_MUST_BE_AN_OBJECT,
      )
    })
  })

  describe('when userId is missing', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput }
      delete (invalidInput as any).userId
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_USERID_MISSING,
      )
    })
  })

  describe('when userId is not a valid UUID', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput, userId: 'invalid-uuid' }
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_USERID_TYPE,
      )
    })
  })

  describe('when accountId is missing', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput }
      delete (invalidInput as any).accountId
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_ACCOUNTID_MISSING,
      )
    })
  })

  describe('when accountId is not a valid UUID', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput, accountId: 'invalid-uuid' }
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_ACCOUNTID_TYPE,
      )
    })
  })

  describe('when categoryId is missing', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput }
      delete (invalidInput as any).categoryId
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_CATEGORY_ID_MISSING,
      )
    })
  })

  describe('when categoryId is not a valid UUID', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput, categoryId: 'invalid-uuid' }
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_CATEGORY_ID_TYPE,
      )
    })
  })

  describe('when name is missing', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput }
      delete (invalidInput as any).name
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_NAME_IS_REQUIRED,
      )
    })
  })

  describe('when name is not a string', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput, name: 123 }
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_NAME_MUST_BE_STRING,
      )
    })
  })

  describe('when name is empty', () => {
    it('should throw a validation error', () => {
      const invalidInput = { ...validInput, name: '' }
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(ValidationError)
      expect(() => validateCreateExpenseSubCategoryInput(invalidInput)).toThrow(
        VALIDATION_ERROR_NAME_EMPTY,
      )
    })
  })

  describe('when all fields are valid', () => {
    it('should not throw any error', () => {
      expect(() => validateCreateExpenseSubCategoryInput(validInput)).not.toThrow()
    })
  })
})
