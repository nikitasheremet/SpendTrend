import { deleteExpenseCategoryRepository } from '../../repository/deleteExpenseCategoryRepository'
import { RepositoryError } from '../../../models/errors/repositoryErrors'
import * as db from '../../../db'

jest.mock('../../../db')

describe('deleteExpenseCategoryRepository', () => {
  const mockDb = db.db as jest.Mocked<typeof db.db>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const fakeId = '00000000-0000-4000-8000-000000000000'
  const fakeDbResult = {
    id: fakeId,
    userId: '00000000-0000-4000-8000-000000000001',
    accountId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Category',
    subcategories: ['sub1', 'sub2'],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  }

  describe('when deletion is successful', () => {
    it('should return the deleted expense category', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbResult]),
        }),
      })
      mockDb.delete = mockDelete

      const result = await deleteExpenseCategoryRepository(fakeId)

      expect(result).toEqual({
        id: fakeId,
        userId: '00000000-0000-4000-8000-000000000001',
        accountId: '00000000-0000-4000-8000-000000000002',
        name: 'Test Category',
        subcategories: ['sub1', 'sub2'],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      })
    })
  })

  describe('when no expense category is found', () => {
    it('should throw RepositoryError with not found message', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      })
      mockDb.delete = mockDelete

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(
        RepositoryError,
      )
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(
        `Not Found Error - No expense category found to delete with id: ${fakeId}`,
      )
    })
  })

  describe('when database error occurs', () => {
    it('should throw RepositoryError with database error message', async () => {
      const fakeError = new Error('Database connection failed')
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(fakeError),
        }),
      })
      mockDb.delete = mockDelete

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(
        RepositoryError,
      )
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(
        'Database Error: Database connection failed',
      )
    })
  })
})