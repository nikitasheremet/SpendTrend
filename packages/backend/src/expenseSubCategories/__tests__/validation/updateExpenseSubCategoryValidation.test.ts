import { validateUpdateExpenseSubCategory } from '../../validation/updateExpenseSubCategoryValidation'
import {
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_SUBCATEGORY_ID_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_ID_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

describe('when validating update expense subCategory input', () => {
  const fakeValidInput = {
    subCategoryId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Subcategory Name',
  }

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      expect(() => validateUpdateExpenseSubCategory(fakeValidInput)).not.toThrow()
    })
  })

  describe('when subCategoryId is invalid', () => {
    it('should throw ValidationError when subCategoryId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput }
      delete (fakeInvalidInput as any).subCategoryId

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_SUBCATEGORY_ID_MISSING),
      )
    })

    it('should throw ValidationError when subCategoryId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, subCategoryId: 'invalid-uuid' }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_SUBCATEGORY_ID_TYPE),
      )
    })
  })

  describe('when userId is invalid', () => {
    it('should throw ValidationError when userId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput }
      delete (fakeInvalidInput as any).userId

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_USERID_MISSING),
      )
    })

    it('should throw ValidationError when userId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: 'invalid-uuid' }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_USERID_TYPE),
      )
    })
  })

  describe('when accountId is invalid', () => {
    it('should throw ValidationError when accountId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput }
      delete (fakeInvalidInput as any).accountId

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING),
      )
    })

    it('should throw ValidationError when accountId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: 'invalid-uuid' }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE),
      )
    })
  })

  describe('when name is invalid', () => {
    it('should throw ValidationError when name is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: undefined }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_NAME_IS_REQUIRED),
      )
    })

    it('should throw ValidationError when name is empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: '' }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_NAME_EMPTY),
      )
    })

    it('should throw ValidationError when name is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: 123 }

      expect(() => validateUpdateExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_NAME_MUST_BE_STRING),
      )
    })
  })
})
