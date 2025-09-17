import { deleteExpenseCategoryRepository } from '../../repository/deleteExpenseCategoryRepository'
import { RepositoryError, NOT_FOUND_ERROR, DB_ERROR } from '../../../models/errors/repositoryErrors'
import { db } from '../../../db'

jest.mock('../../../db')

describe('deleteExpenseCategoryRepository', () => {
  const mockDb = db as jest.Mocked<typeof db>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const fakeId = '00000000-0000-4000-8000-000000000000'
  const fakeUserId = '11111111-1111-4111-8111-111111111111'
  const fakeAccountId = '22222222-2222-4222-8222-222222222222'
  const fakeSubCategoryId = '33333333-3333-4333-8333-333333333333'

  const fakeSubCategory = {
    id: fakeSubCategoryId,
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Test SubCategory',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  }

  const fakeCategoryWithSubCategories = {
    id: fakeId,
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Test Category',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
    subCategories: [fakeSubCategory],
  }

  describe('when deletion is successful', () => {
    it('should return the deleted expense category with subcategories', async () => {
      // Mock the query to return category with subcategories
      const mockFindFirst = jest.fn().mockResolvedValue(fakeCategoryWithSubCategories)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as any

      // Mock the delete to succeed
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      })
      mockDb.delete = mockDelete

      const result = await deleteExpenseCategoryRepository(fakeId)

      expect(result).toEqual({
        id: fakeId,
        userId: fakeUserId,
        accountId: fakeAccountId,
        name: 'Test Category',
        subCategories: [{ ...fakeSubCategory }],
        createdAt: fakeCategoryWithSubCategories.createdAt,
        updatedAt: fakeCategoryWithSubCategories.updatedAt,
      })
    })
  })

  describe('when no expense category is found', () => {
    it('should throw RepositoryError with not found message', async () => {
      // Mock the query to return null
      const mockFindFirst = jest.fn().mockResolvedValue(null)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as any

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(NOT_FOUND_ERROR)
    })
  })

  describe('when database error occurs during find', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Database connection failed')

      // Mock the query to throw error
      const mockFindFirst = jest.fn().mockRejectedValue(fakeError)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as any

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(DB_ERROR)
    })
  })

  describe('when database error occurs during delete', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Delete failed')

      // Mock the query to succeed
      const mockFindFirst = jest.fn().mockResolvedValue(fakeCategoryWithSubCategories)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as any

      // Mock the delete to fail
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValue(fakeError),
      })
      mockDb.delete = mockDelete

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(DB_ERROR)
    })
  })
})
