import type { Context } from 'hono'
import { deleteExpenseSubCategoryHandler } from '../../handler/deleteExpenseSubCategoryHandler'
import { validateDeleteExpenseSubCategory } from '../../validation'
import { deleteExpenseSubCategoryService } from '../../service/deleteExpenseSubCategoryService'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'

jest.mock('../../validation')
jest.mock('../../service/deleteExpenseSubCategoryService')

describe('when using deleteExpenseSubCategoryHandler', () => {
  const mockValidate = validateDeleteExpenseSubCategory as jest.Mock
  const mockService = deleteExpenseSubCategoryService as jest.Mock

  const fakeInput = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subCategoryId: '123e4567-e89b-12d3-a456-426614174002',
  }

  const fakeDeletedSubCategory = {
    id: fakeInput.subCategoryId,
    user_id: fakeInput.userId,
    account_id: fakeInput.accountId,
    name: 'Fake SubCategory',
    category_id: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date(),
    updated_at: new Date(),
  }

  let fakeContext: Context

  beforeEach(() => {
    jest.resetAllMocks()
    fakeContext = {
      req: {
        json: jest.fn(),
      },
    } as unknown as Context
  })

  it('should handle validation errors', async () => {
    const fakeValidationError = new Error('Validation failed')
    mockValidate.mockImplementation(() => {
      throw fakeValidationError
    })

    const response = await deleteExpenseSubCategoryHandler(fakeContext)

    expect(response.status).not.toBe(STATUS_SUCCESS_200)
    const body = await response.json()
    expect(body).toEqual({ error: fakeValidationError.message })
  })

  it('should handle error from service', async () => {
    const fakeNotFoundError = new Error(`Subcategory not found`)
    mockService.mockRejectedValue(fakeNotFoundError)

    const response = await deleteExpenseSubCategoryHandler(fakeContext)

    expect(response.status).not.toBe(STATUS_SUCCESS_200)
    const body = await response.json()
    expect(body).toEqual({ error: fakeNotFoundError.message })
  })

  it('should return deleted subcategory on success', async () => {
    mockService.mockResolvedValue(fakeDeletedSubCategory)

    const response = await deleteExpenseSubCategoryHandler(fakeContext)

    expect(response.status).toBe(STATUS_SUCCESS_200)
    const body = await response.json()
    expect(body).toEqual({ deletedExpenseSubCategory: fakeDeletedSubCategory })
  })
})
