import {
  updateExpenseCategoryRepository,
  UpdateExpenseCategoryRepoInput,
} from '../../repository/updateExpenseCategoryRepository'
import { db } from '../../../db'
import { RepositoryError, DB_ERROR, NOT_FOUND_ERROR } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('updateExpenseCategoryRepository', () => {
  const mockDbUpdate = db.update as jest.Mock

  const fakeInput: UpdateExpenseCategoryRepoInput = {
    id: 'expense-category-1',
    updates: { name: 'Updated Name' },
  }

  let returningMock: jest.Mock
  let whereMock: jest.Mock
  let setMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    // create the chain used by the repository: update(...).set(...).where(...).returning()
    returningMock = jest.fn()
    whereMock = jest.fn().mockReturnValue({ returning: returningMock })
    setMock = jest.fn().mockReturnValue({ where: whereMock })
    mockDbUpdate.mockReturnValue({ set: setMock })
  })

  describe('when the database update throws an error', () => {
    it('should throw a repository error with DB_ERROR', async () => {
      mockDbUpdate.mockImplementation(() => {
        throw new Error('DB update error')
      })

      await expect(updateExpenseCategoryRepository(fakeInput)).rejects.toThrow(DB_ERROR)
      await expect(updateExpenseCategoryRepository(fakeInput)).rejects.toBeInstanceOf(
        RepositoryError,
      )
    })
  })

  describe('when the database returning returns an empty array', () => {
    it('should throw a repository error with NOT_FOUND_ERROR', async () => {
      const fakeNoExpenseCategoriesUpdated: [] = []
      returningMock.mockResolvedValueOnce(fakeNoExpenseCategoriesUpdated)

      const promiseResult = updateExpenseCategoryRepository(fakeInput)
      await expect(promiseResult).rejects.toThrow(NOT_FOUND_ERROR)
      await expect(promiseResult).rejects.toBeInstanceOf(RepositoryError)
    })
  })

  describe.skip('when the database update succeeds', () => {
    it('should return the updated expense category mapped to the domain version', async () => {
      const fakeDbExpenseCategory = {
        id: 'expense-category-1',
        createdAt: new Date('2025-09-01T00:00:00Z'),
        updatedAt: new Date('2025-09-01T00:00:00Z'),
      }

      returningMock.mockResolvedValueOnce([fakeDbExpenseCategory])

      const result = await updateExpenseCategoryRepository(fakeInput)

      expect(result).toEqual(
        expect.objectContaining({
          ...fakeDbExpenseCategory,
          createdAt: fakeDbExpenseCategory.createdAt.toISOString(),
          updatedAt: fakeDbExpenseCategory.updatedAt.toISOString(),
        }),
      )
    })
  })
})
