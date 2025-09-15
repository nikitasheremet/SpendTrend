import { validateCreateExpenseCategoryInput } from '../../validation/createExpenseCategoryValidation'
import {
  ValidationError,
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
} from '../../../models/errors/validationError'

describe('createExpenseCategoryValidation', () => {
  const fakeValidInput = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    name: 'Groceries',
    subcategories: ['Produce', 'Dairy'],
  }

  describe('when input is undefined', () => {
    it('should throw input is required error', () => {
      const callValidation = () => validateCreateExpenseCategoryInput(undefined)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
    })
  })

  describe('when validating userId', () => {
    it('should require userId', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: undefined }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should require userId to be a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: 'not-a-uuid' }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when validating accountId', () => {
    it('should require accountId', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: undefined }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })

    it('should require accountId to be a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: 'not-a-uuid' }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })

  describe('when validating name', () => {
    it('should require name', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: undefined }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_NAME_IS_REQUIRED)
    })

    it('should require name to be a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: 123 }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_NAME_MUST_BE_STRING)
    })

    it('should require name to be non-empty', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: '' }
      const callValidation = () => validateCreateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_NAME_EMPTY)
    })
  })

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      const callValidation = () => validateCreateExpenseCategoryInput(fakeValidInput)
      expect(callValidation).not.toThrow()
    })
  })
})
