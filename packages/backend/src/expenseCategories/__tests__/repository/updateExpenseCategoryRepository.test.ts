import {
  updateExpenseCategoryRepository,
  UpdateExpenseCategoryRepoInput,
} from '../../repository/updateExpenseCategoryRepository'
import { db } from '../../../db'
import { RepositoryError, DB_ERROR, NOT_FOUND_ERROR } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('updateExpenseCategoryRepository', () => {
  const mockDbUpdate = db.update as jest.Mock
  const mockDbSelect = db.select as jest.Mock

  const fakeInput: UpdateExpenseCategoryRepoInput = {
    id: 'expense-category-1',
    updates: { name: 'Updated Name' },
  }

  let returningMock: jest.Mock
  let whereMock: jest.Mock
  let setMock: jest.Mock
  let fromMock: jest.Mock
  let selectWhereMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    // create the chain used by the repository: update(...).set(...).where(...).returning()
    returningMock = jest.fn()
    whereMock = jest.fn().mockReturnValue({ returning: returningMock })
    setMock = jest.fn().mockReturnValue({ where: whereMock })
    mockDbUpdate.mockReturnValue({ set: setMock })

    // create the chain for select: select().from(...).where(...)
    selectWhereMock = jest.fn()
    fromMock = jest.fn().mockReturnValue({ where: selectWhereMock })
    mockDbSelect.mockReturnValue({ from: fromMock })
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

  describe('when the database select for subcategories throws an error', () => {
    it('should throw a repository error with DB_ERROR', async () => {
      const fakeDbExpenseCategory = {
        id: 'expense-category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Updated Name',
        createdAt: new Date('2025-09-01T00:00:00Z'),
        updatedAt: new Date('2025-09-01T00:00:00Z'),
      }

      returningMock.mockResolvedValueOnce([fakeDbExpenseCategory])
      selectWhereMock.mockRejectedValueOnce(new Error('DB select error'))

      await expect(updateExpenseCategoryRepository(fakeInput)).rejects.toThrow(DB_ERROR)
      await expect(updateExpenseCategoryRepository(fakeInput)).rejects.toBeInstanceOf(
        RepositoryError,
      )
    })
  })

  describe('when the database update succeeds', () => {
    it('should return the updated expense category with subcategories mapped to the domain version', async () => {
      const fakeDbExpenseCategory = {
        id: 'expense-category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Updated Name',
        createdAt: new Date('2025-09-01T00:00:00Z'),
        updatedAt: new Date('2025-09-01T00:00:00Z'),
      }

      const fakeSubCategories = [
        {
          id: 'sub-1',
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Sub Category 1',
          categoryId: 'expense-category-1',
          createdAt: new Date('2025-09-01T00:00:00Z'),
          updatedAt: new Date('2025-09-01T00:00:00Z'),
        },
      ]

      returningMock.mockResolvedValueOnce([fakeDbExpenseCategory])
      selectWhereMock.mockResolvedValueOnce(fakeSubCategories)

      const result = await updateExpenseCategoryRepository(fakeInput)

      expect(result).toEqual({
        id: 'expense-category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Updated Name',
        subCategories: [
          {
            ...fakeSubCategories[0],
          },
        ],
        createdAt: new Date('2025-09-01T00:00:00Z'),
        updatedAt: new Date('2025-09-01T00:00:00Z'),
      })
    })
  })
})
