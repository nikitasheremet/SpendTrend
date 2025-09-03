import { deleteExpenseCategoryHandler } from '../../handler/deleteExpenseCategoryHandler'
import * as service from '../../service/deleteExpenseCategoryService'
import * as validation from '../../validation/deleteExpenseCategoryValidation'
import { ValidationError } from '../../../models/errors/validationError'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../service/deleteExpenseCategoryService')
jest.mock('../../validation/deleteExpenseCategoryValidation')

describe('deleteExpenseCategoryHandler', () => {
  const mockService = service.deleteExpenseCategoryService as jest.Mock
  const mockValidation = validation.validateDeleteExpenseCategoryInput as jest.Mock

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  const fakeValidRequest = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    id: '00000000-0000-4000-8000-000000000002',
  }

  const fakeValidContext: any = {
    request: {
      body: fakeValidRequest,
    },
    status: 0,
    body: undefined,
  }

  const fakeResult = {
    id: '00000000-0000-4000-8000-000000000002',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    name: 'Test Category',
    subcategories: ['sub1', 'sub2'],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  }

  describe('when request is successful', () => {
    it('should return 200 and deleted expenseCategory', async () => {
      mockService.mockResolvedValueOnce(fakeResult)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(mockValidation).toHaveBeenCalledWith(fakeValidRequest)
      expect(mockService).toHaveBeenCalledWith(fakeValidRequest)
      expect(fakeValidContext.status).toBe(200)
      expect(fakeValidContext.body).toEqual({ expenseCategory: fakeResult })
    })
  })

  describe('when validation throws ValidationError', () => {
    it('should return 422 and error message', async () => {
      const fakeValidationError = new ValidationError('Validation failed')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).toBe(422)
      expect(fakeValidContext.body).toEqual({ error: 'Validation failed' })
    })
  })

  describe('when service throws RepositoryError', () => {
    it('should return 500 and error message', async () => {
      const fakeRepositoryError = new RepositoryError('Database error')
      mockService.mockRejectedValueOnce(fakeRepositoryError)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).toBe(500)
      expect(fakeValidContext.body).toEqual({ error: 'Database error' })
    })
  })

  describe('when service throws unknown error', () => {
    it('should return 500 and error message', async () => {
      const fakeUnknownError = new Error('Unknown error')
      mockService.mockRejectedValueOnce(fakeUnknownError)

      await deleteExpenseCategoryHandler(fakeValidContext)

      expect(fakeValidContext.status).toBe(500)
      expect(fakeValidContext.body).toEqual({ error: 'Unknown error' })
    })
  })
})