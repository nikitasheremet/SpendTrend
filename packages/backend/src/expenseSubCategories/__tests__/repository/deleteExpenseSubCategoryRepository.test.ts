import {
  deleteExpenseSubCategoryRepository,
  deleteExpenseSubCategoryReferencesInExpenses,
} from '../../repository/deleteExpenseSubCategoryRepository'
import { db } from '../../../db'
import { RepositoryError, NOT_FOUND_ERROR, DB_ERROR } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
const mockDb = db

describe('deleteExpenseSubCategoryRepository', () => {
  const fakeInput = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    subCategoryId: '123e4567-e89b-12d3-a456-426614174002',
  }

  const fakeDeletedSubCategory = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Test SubCategory',
    categoryId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    console.error = jest.fn()
  })

  it('should delete the subcategory and return the deleted row', async () => {
    // Mock DB delete operation
    const mockDelete = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([fakeDeletedSubCategory]),
      }),
    })
    mockDb.delete = mockDelete

    const result = await deleteExpenseSubCategoryRepository(fakeInput)

    expect(result).toEqual(fakeDeletedSubCategory)
  })

  it('should throw a NotFound error when subcategory does not exist', async () => {
    // Mock DB delete operation returning empty array (no rows found)
    const mockDelete = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    })
    mockDb.delete = mockDelete

    const promiseResult = deleteExpenseSubCategoryRepository(fakeInput)

    await expect(promiseResult).rejects.toThrow(RepositoryError)
    await expect(promiseResult).rejects.toThrow(NOT_FOUND_ERROR)
  })

  it('should propagate DB errors with a wrapped RepositoryError', async () => {
    // Mock DB delete operation throwing error
    const fakeDatabaseError = new Error('Database connection failed')
    const mockDelete = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValue(fakeDatabaseError),
      }),
    })
    mockDb.delete = mockDelete

    const promiseResult = deleteExpenseSubCategoryRepository(fakeInput)

    await expect(promiseResult).rejects.toThrow(RepositoryError)
    await expect(promiseResult).rejects.toThrow(DB_ERROR)
  })
})

describe('deleteExpenseSubCategoryReferencesInExpenses', () => {
  const fakeSubCategoryId = '123e4567-e89b-12d3-a456-426614174002'

  beforeEach(() => {
    jest.resetAllMocks()
    console.error = jest.fn()
  })

  it('should update all expenses referencing the deleted subcategory and return the count', async () => {
    // Mock DB update operation
    const mockUpdate = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          rowCount: 3,
        }),
      }),
    })
    mockDb.update = mockUpdate

    const result = await deleteExpenseSubCategoryReferencesInExpenses(fakeSubCategoryId)

    expect(result).toBe(3)
  })

  it('should throw a RepositoryError when DB update fails', async () => {
    // Mock DB update operation throwing error
    const fakeDatabaseError = new Error('Database connection failed')
    const mockUpdate = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValue(fakeDatabaseError),
      }),
    })
    mockDb.update = mockUpdate

    const promiseResult = deleteExpenseSubCategoryReferencesInExpenses(fakeSubCategoryId)

    await expect(promiseResult).rejects.toThrow(RepositoryError)
    await expect(promiseResult).rejects.toThrow(DB_ERROR)
  })
})
