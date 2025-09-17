import { updateExpenseSubCategoryRepository } from '../../repository/updateExpenseSubCategoryRepository'
import { db } from '../../../db'
import { DB_ERROR, NOT_FOUND_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
const mockDb = db

describe('updateExpenseSubCategoryRepository', () => {
  const fakeSubCategoryId = '123e4567-e89b-12d3-a456-426614174000'
  const fakePatch = {
    name: 'Updated Name',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
  }

  const fakeDbRow = {
    id: fakeSubCategoryId,
    userId: fakePatch.userId,
    accountId: fakePatch.accountId,
    name: fakePatch.name,
    categoryId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeDomainObject = {
    id: fakeSubCategoryId,
    userId: fakePatch.userId,
    accountId: fakePatch.accountId,
    name: fakePatch.name,
    categoryId: '123e4567-e89b-12d3-a456-426614174003',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    console.error = jest.fn()
  })

  describe('when database update succeeds', () => {
    it('should return mapped domain object', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([fakeDbRow]),
          }),
        }),
      })
      mockDb.update = mockUpdate

      const result = await updateExpenseSubCategoryRepository(fakeSubCategoryId, fakePatch)

      expect(result).toEqual(fakeDomainObject)
    })

    describe('when database update returns no rows', () => {
      it('should throw RepositoryError', async () => {
        const mockUpdate = jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              returning: jest.fn().mockResolvedValue([]),
            }),
          }),
        })
        mockDb.update = mockUpdate

        const promiseResult = updateExpenseSubCategoryRepository(fakeSubCategoryId, fakePatch)

        await expect(promiseResult).rejects.toThrow(RepositoryError)
        await expect(promiseResult).rejects.toThrow(NOT_FOUND_ERROR)
      })
    })

    describe('when database throws an error', () => {
      it('should throw RepositoryError with error details', async () => {
        const fakeDatabaseError = new Error('Database connection failed')
        const mockUpdate = jest.fn().mockReturnValue({
          set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              returning: jest.fn().mockRejectedValue(fakeDatabaseError),
            }),
          }),
        })
        mockDb.update = mockUpdate

        const promiseResult = updateExpenseSubCategoryRepository(fakeSubCategoryId, fakePatch)
        await expect(promiseResult).rejects.toThrow(RepositoryError)
        await expect(promiseResult).rejects.toThrow(DB_ERROR)
      })
    })
  })
})
