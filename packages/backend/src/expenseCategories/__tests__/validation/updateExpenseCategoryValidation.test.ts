import { validateUpdateExpenseCategoryInput } from '../../validation/updateExpenseCategoryValidation'
import {
  ValidationError,
  VALIDATION_ERROR_EXPENSECATEGORYID_MISSING,
  VALIDATION_ERROR_EXPENSECATEGORYID_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_SUBCATEGORIES_MUST_BE_ARRAY,
  VALIDATION_ERROR_SUBCATEGORIES_ITEMS_MUST_BE_STRINGS,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
  VALIDATION_ERROR_UPDATE_EXPENSECATEGORY_AT_LEAST_ONE_FIELD_REQUIRED,
} from '../../../models/errors/validationError'

describe('validateUpdateExpenseCategoryInput', () => {
  const fakeValidInput = {
    id: '00000000-0000-4000-8000-000000000002',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    name: 'Updated Groceries',
  }

  describe('when input is undefined', () => {
    it('should throw input is required error', () => {
      const callValidation = () => validateUpdateExpenseCategoryInput(undefined)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_INPUT_MUST_BE_AN_OBJECT)
    })
  })

  describe('when validating id', () => {
    it('should require id', () => {
      const fakeInvalidInput = { ...fakeValidInput, id: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_EXPENSECATEGORYID_MISSING)
    })

    it('should require id to be a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, id: 'not-a-uuid' }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_EXPENSECATEGORYID_TYPE)
    })
  })

  describe('when validating userId', () => {
    it('should require userId', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_USERID_MISSING)
    })

    it('should require userId to be a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: 'not-a-uuid' }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_USERID_TYPE)
    })
  })

  describe('when validating accountId', () => {
    it('should require accountId', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_ACCOUNTID_MISSING)
    })

    it('should require accountId to be a uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: 'not-a-uuid' }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_ACCOUNTID_TYPE)
    })
  })

  describe('when validating name', () => {
    it('should require name to be a string when provided', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: 123 }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_NAME_MUST_BE_STRING)
    })

    it('should require name to be non-empty when provided', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: '' }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_NAME_EMPTY)
    })
  })

  describe('when validating subcategories', () => {
    it('should require subcategories to be an array when provided', () => {
      const fakeInvalidInput = { ...fakeValidInput, subcategories: 'not-an-array', name: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_SUBCATEGORIES_MUST_BE_ARRAY)
    })

    it('should require all subcategory items to be strings when provided', () => {
      const fakeInvalidInput = { ...fakeValidInput, subcategories: ['Good', 123], name: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(VALIDATION_ERROR_SUBCATEGORIES_ITEMS_MUST_BE_STRINGS)
    })

    it('should allow empty subcategories array when provided', () => {
      const fakeValidInputWithEmptySubcategories = {
        ...fakeValidInput,
        subcategories: [],
        name: undefined,
      }
      const callValidation = () =>
        validateUpdateExpenseCategoryInput(fakeValidInputWithEmptySubcategories)
      expect(callValidation).not.toThrow()
    })
  })

  describe('when neither name nor subcategories is provided', () => {
    it('should throw error that at least one must be provided', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: undefined }
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeInvalidInput)
      expect(callValidation).toThrow(ValidationError)
      expect(callValidation).toThrow(
        VALIDATION_ERROR_UPDATE_EXPENSECATEGORY_AT_LEAST_ONE_FIELD_REQUIRED,
      )
    })
  })

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      const callValidation = () => validateUpdateExpenseCategoryInput(fakeValidInput)
      expect(callValidation).not.toThrow()
    })
  })
})
