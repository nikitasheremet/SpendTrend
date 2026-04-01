import {
  deleteExpenseCategoryRepository,
  deleteExpenseCategoryReferencesInExpenses,
} from '../../repository/deleteExpenseCategoryRepository'
import { RepositoryError, NOT_FOUND_ERROR, DB_ERROR } from '../../../models/errors/repositoryErrors'
import { db } from '../../../db'

vi.mock('../../../db')

describe('deleteExpenseCategoryRepository', () => {
  const mockDb = db as Mocked<typeof db>

  beforeEach(() => {
    vi.resetAllMocks()
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
      const mockFindFirst = vi.fn().mockResolvedValue(fakeCategoryWithSubCategories)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as unknown as typeof mockDb.query

      const mockSelectWhere = vi.fn().mockResolvedValue([{ id: fakeSubCategoryId }])
      const mockSelectFrom = vi.fn().mockReturnValue({
        where: mockSelectWhere,
      })
      const mockSelect = vi.fn().mockReturnValue({
        from: mockSelectFrom,
      })
      mockDb.select = mockSelect

      const mockUpdateWhere = vi.fn().mockResolvedValue({ rowCount: 2 })
      const mockUpdateSet = vi.fn().mockReturnValue({
        where: mockUpdateWhere,
      })
      const mockUpdate = vi.fn().mockReturnValue({
        set: mockUpdateSet,
      })
      mockDb.update = mockUpdate

      // Mock the delete to succeed
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
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
      const mockFindFirst = vi.fn().mockResolvedValue(null)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as unknown as typeof mockDb.query

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(NOT_FOUND_ERROR)
    })
  })

  describe('when database error occurs during find', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Database connection failed')

      // Mock the query to throw error
      const mockFindFirst = vi.fn().mockRejectedValue(fakeError)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as unknown as typeof mockDb.query

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(DB_ERROR)
    })
  })

  describe('when database error occurs during delete', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Delete failed')

      // Mock the query to succeed
      const mockFindFirst = vi.fn().mockResolvedValue(fakeCategoryWithSubCategories)
      mockDb.query = {
        expenseCategoriesTable: {
          findFirst: mockFindFirst,
        },
      } as unknown as typeof mockDb.query

      const mockSelectWhere = vi.fn().mockResolvedValue([{ id: fakeSubCategoryId }])
      const mockSelectFrom = vi.fn().mockReturnValue({
        where: mockSelectWhere,
      })
      const mockSelect = vi.fn().mockReturnValue({
        from: mockSelectFrom,
      })
      mockDb.select = mockSelect

      const mockUpdateWhere = vi.fn().mockResolvedValue({ rowCount: 1 })
      const mockUpdateSet = vi.fn().mockReturnValue({
        where: mockUpdateWhere,
      })
      const mockUpdate = vi.fn().mockReturnValue({
        set: mockUpdateSet,
      })
      mockDb.update = mockUpdate

      // Mock the delete to fail
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockRejectedValue(fakeError),
      })
      mockDb.delete = mockDelete

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(DB_ERROR)
    })
  })
})

describe('deleteExpenseCategoryReferencesInExpenses', () => {
  const mockDb = db as Mocked<typeof db>
  const fakeCategoryId = '00000000-0000-4000-8000-000000000010'
  const fakeSubCategoryId = '00000000-0000-4000-8000-000000000011'

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when expenses are updated successfully', () => {
    it('should return affected row count', async () => {
      const mockSelectWhere = vi.fn().mockResolvedValue([{ id: fakeSubCategoryId }])
      const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere })
      const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom })
      mockDb.select = mockSelect

      const mockUpdateWhere = vi.fn().mockResolvedValue({ rowCount: 3 })
      const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet })
      mockDb.update = mockUpdate

      const result = await deleteExpenseCategoryReferencesInExpenses(fakeCategoryId)

      expect(result).toBe(3)
    })
  })

  describe('when expense update fails', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Update failed')

      const mockSelectWhere = vi.fn().mockResolvedValue([{ id: fakeSubCategoryId }])
      const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere })
      const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom })
      mockDb.select = mockSelect

      const mockUpdateWhere = vi.fn().mockRejectedValue(fakeError)
      const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet })
      mockDb.update = mockUpdate

      const promiseResult = deleteExpenseCategoryReferencesInExpenses(fakeCategoryId)

      await expect(promiseResult).rejects.toThrow(RepositoryError)
      await expect(promiseResult).rejects.toThrow(DB_ERROR)
    })
  })
})
