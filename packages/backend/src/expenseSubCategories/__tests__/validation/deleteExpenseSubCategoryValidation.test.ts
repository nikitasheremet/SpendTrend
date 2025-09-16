import { validateDeleteExpenseSubCategory } from '../../validation/deleteExpenseSubCategoryValidation'
import {
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_SUBCATEGORY_ID_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_ID_TYPE,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  ValidationError,
} from '../../../models/errors/validationError'

describe('when validating delete expense SubCategory input', () => {
  const fakeValidInput = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subCategoryId: '123e4567-e89b-12d3-a456-426614174002',
  }

  describe('when input is valid', () => {
    it('should not throw an error', () => {
      expect(() => validateDeleteExpenseSubCategory(fakeValidInput)).not.toThrow()
    })
  })

  describe('when userId is invalid', () => {
    it('should throw ValidationError when userId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: undefined }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_USERID_MISSING),
      )
    })

    it('should throw ValidationError when userId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: 'invalid-uuid' }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_USERID_TYPE),
      )
    })
  })

  describe('when accountId is invalid', () => {
    it('should throw ValidationError when accountId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: undefined }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_ACCOUNTID_MISSING),
      )
    })

    it('should throw ValidationError when accountId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: 'invalid-uuid' }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_ACCOUNTID_TYPE),
      )
    })
  })

  describe('when subCategoryId is invalid', () => {
    it('should throw ValidationError when subCategoryId is missing', () => {
      const fakeInvalidInput = { ...fakeValidInput, subCategoryId: undefined }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_SUBCATEGORY_ID_MISSING),
      )
    })

    it('should throw ValidationError when subCategoryId is not a valid UUID', () => {
      const fakeInvalidInput = { ...fakeValidInput, subCategoryId: 'invalid-uuid' }

      expect(() => validateDeleteExpenseSubCategory(fakeInvalidInput)).toThrow(
        new ValidationError(VALIDATION_ERROR_SUBCATEGORY_ID_TYPE),
      )
    })
  })
})
