import { deleteExpenseCategoryRepository } from '../../repository/deleteExpenseCategoryRepository'
import { RepositoryError, NOT_FOUND_ERROR, DB_ERROR } from '../../../models/errors/repositoryErrors'
import { db } from '../../../db'

jest.mock('../../../db')

describe('deleteExpenseCategoryRepository', () => {
  const mockDb = db as jest.Mocked<typeof db>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const fakeId = '00000000-0000-4000-8000-000000000000'
  const fakeDbResult = {
    id: fakeId,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  }

  describe.skip('when deletion is successful', () => {
    it('should return the deleted expense category', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbResult]),
        }),
      })
      mockDb.delete = mockDelete

      const result = await deleteExpenseCategoryRepository(fakeId)

      expect(result).toEqual(
        expect.objectContaining({
          id: fakeId,
          createdAt: fakeDbResult.createdAt.toISOString(),
          updatedAt: fakeDbResult.updatedAt.toISOString(),
        }),
      )
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

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(NOT_FOUND_ERROR)
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

      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(RepositoryError)
      await expect(deleteExpenseCategoryRepository(fakeId)).rejects.toThrow(DB_ERROR)
    })
  })
})
