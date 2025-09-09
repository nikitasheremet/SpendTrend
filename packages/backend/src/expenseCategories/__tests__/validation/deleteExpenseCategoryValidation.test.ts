import { validateDeleteExpenseCategoryInput } from '../../validation/deleteExpenseCategoryValidation'
import { ValidationError } from '../../../models/errors/validationError'

describe('validateDeleteExpenseCategoryInput', () => {
  const fakeValidInput = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    id: '00000000-0000-4000-8000-000000000002',
  }

  describe('when input is valid', () => {
    it('should not throw any error', () => {
      expect(() => validateDeleteExpenseCategoryInput(fakeValidInput)).not.toThrow()
    })
  })

  describe('userId validation', () => {
    describe('when userId is missing', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput }
        delete (fakeInvalidInput as any).userId

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })

    describe('when userId is not a valid UUID', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput, userId: 'invalid-uuid' }

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })
  })

  describe('accountId validation', () => {
    describe('when accountId is missing', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput }
        delete (fakeInvalidInput as any).accountId

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })

    describe('when accountId is not a valid UUID', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput, accountId: 'invalid-uuid' }

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })
  })

  describe('id validation', () => {
    describe('when id is missing', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput }
        delete (fakeInvalidInput as any).id

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })

    describe('when id is not a valid UUID', () => {
      it('should throw ValidationError', () => {
        const fakeInvalidInput = { ...fakeValidInput, id: 'invalid-uuid' }

        expect(() => validateDeleteExpenseCategoryInput(fakeInvalidInput)).toThrow(
          ValidationError,
        )
      })
    })
  })

  describe('when input is not an object', () => {
    it('should throw ValidationError', () => {
      expect(() => validateDeleteExpenseCategoryInput('not an object')).toThrow(
        ValidationError,
      )
    })
  })
})