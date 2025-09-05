import { deleteExpenseCategoryRepository } from '../../repository/deleteExpenseCategoryRepository'
import { RepositoryError, NOT_FOUND_ERROR, DB_ERROR } from '../../../models/errors/repositoryErrors'
import { db } from '../../../db'
import { dbExpenseCategoryToDomain } from '../../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain'

jest.mock('../../../db')
jest.mock('../../../utilities/mappers/expenseCategory/dBExpenseCategoryToDomain')

describe('deleteExpenseCategoryRepository', () => {
  const mockDb = db as jest.Mocked<typeof db>
  const mockMapper = dbExpenseCategoryToDomain as jest.MockedFunction<typeof dbExpenseCategoryToDomain>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const fakeId = '00000000-0000-4000-8000-000000000000'
  const fakeDbResult = {
    id: fakeId,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  }

  const fakeDomainResult = {
    id: fakeId,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  }

  describe('when deletion is successful', () => {
    it('should return the deleted expense category', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbResult]),
        }),
      })
      mockDb.delete = mockDelete
      mockMapper.mockReturnValue(fakeDomainResult as any)

      const result = await deleteExpenseCategoryRepository(fakeId)

      expect(result).toEqual(fakeDomainResult)
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
        NOT_FOUND_ERROR,
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
        DB_ERROR,
      )
    })
  })
})