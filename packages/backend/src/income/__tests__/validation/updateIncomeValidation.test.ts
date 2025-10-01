import { validateUpdateIncomeInput } from '../../validation/updateIncomeValidation'
import {
  ValidationError,
  VALIDATION_ERROR_INCOMEID_MISSING,
  VALIDATION_ERROR_INCOMEID_TYPE,
  VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_AMOUNT_TYPE,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_DATE_TYPE,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'

describe('validateUpdateIncomeInput', () => {
  const fakeValidInput = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174003',
    accountId: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Salary',
    amount: 5000,
    date: '2025-08-22',
  }

  describe('when id is invalid', () => {
    it('should throw an error if id is missing', () => {
      const fakeInvalidInput = { name: fakeValidInput.name }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_INCOMEID_MISSING,
      )
    })

    it('should throw an error if id is not uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, id: 123 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_INCOMEID_TYPE,
      )
    })
  })

  describe('when userId is invalid', () => {
    it('should throw an error if userId is missing', () => {
      const fakeInvalidInput = {
        id: fakeValidInput.id,
        accountId: fakeValidInput.accountId,
        name: fakeValidInput.name,
      }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_USERID_MISSING,
      )
    })

    it('should throw an error if userId is not uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, userId: 123 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_USERID_TYPE,
      )
    })
  })

  describe('when accountId is invalid', () => {
    it('should throw an error if accountId is missing', () => {
      const fakeInvalidInput = {
        id: fakeValidInput.id,
        userId: fakeValidInput.userId,
        name: fakeValidInput.name,
      }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_ACCOUNTID_MISSING,
      )
    })

    it('should throw an error if accountId is not uuid', () => {
      const fakeInvalidInput = { ...fakeValidInput, accountId: 123 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_ACCOUNTID_TYPE,
      )
    })
  })

  describe('when "name" is present and is invalid', () => {
    it('should throw an error if name is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: 123 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NAME_MUST_BE_STRING,
      )
    })

    it('should throw an error if name is an empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, name: '' }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NAME_EMPTY,
      )
    })
  })

  describe('when "amount" is present and is invalid', () => {
    it('should throw an error if amount is not a number', () => {
      const fakeInvalidInput = { ...fakeValidInput, amount: '123' }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_AMOUNT_TYPE,
      )
    })

    it('should throw an error if amount is negative', () => {
      const fakeInvalidInput = { ...fakeValidInput, amount: -1 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_AMOUNT_NEGATIVE,
      )
    })
  })

  describe('when "date" is present and is invalid', () => {
    it('should throw an error if date is not a string', () => {
      const fakeInvalidInput = { ...fakeValidInput, date: 20200101 }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(VALIDATION_ERROR_DATE_TYPE)
    })

    it('should throw an error if date is an empty string', () => {
      const fakeInvalidInput = { ...fakeValidInput, date: '' }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_DATE_EMPTY,
      )
    })

    it('should throw an error if date format is invalid', () => {
      const fakeInvalidInput = { ...fakeValidInput, date: '2025/08/22' }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_DATE_FORMAT,
      )
    })
  })

  describe('when all fields are present and valid', () => {
    it('should not throw an error', () => {
      expect(() => validateUpdateIncomeInput(fakeValidInput)).not.toThrow()
    })
  })

  describe('when no updateable fields are present', () => {
    it('should throw no updatable field error', () => {
      const fakeInvalidInput = {
        id: fakeValidInput.id,
        userId: fakeValidInput.userId,
        accountId: fakeValidInput.accountId,
      }
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(ValidationError)
      expect(() => validateUpdateIncomeInput(fakeInvalidInput)).toThrow(
        VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
      )
    })
  })
})
