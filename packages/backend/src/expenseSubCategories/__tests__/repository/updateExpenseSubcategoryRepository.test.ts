import {
  updateExpenseSubcategoryRepository,
  getExpenseSubCategoryByIdRepository,
} from '../../repository/updateExpenseSubCategoryRepository'
import { db } from '../../../db'
import { expenseSubCategoriesTable } from '../../../db/schema'
import { dbExpenseSubCategoryToDomain } from '../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
jest.mock('../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain')

const mockDb = db as jest.Mocked<typeof db>
const mockDbExpenseSubCategoryToDomain = dbExpenseSubCategoryToDomain as jest.MockedFunction<
  typeof dbExpenseSubCategoryToDomain
>

describe('when updating expense subcategory repository', () => {
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
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  describe('when updating subcategory', () => {
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
        mockDbExpenseSubCategoryToDomain.mockReturnValue(fakeDomainObject)

        const result = await updateExpenseSubcategoryRepository(fakeSubCategoryId, fakePatch)

        expect(result).toEqual(fakeDomainObject)
        expect(mockUpdate).toHaveBeenCalledWith(expenseSubCategoriesTable)
        expect(mockDbExpenseSubCategoryToDomain).toHaveBeenCalledWith(fakeDbRow)
      })
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

        await expect(
          updateExpenseSubcategoryRepository(fakeSubCategoryId, fakePatch),
        ).rejects.toThrow(new RepositoryError('Expense subcategory not found'))
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

        await expect(
          updateExpenseSubcategoryRepository(fakeSubCategoryId, fakePatch),
        ).rejects.toThrow(RepositoryError)

        expect(console.error).toHaveBeenCalledWith(
          `Failed to update expense subcategory with id: ${fakeSubCategoryId}`,
          fakeDatabaseError,
        )
      })
    })
  })

  describe('when getting subcategory by id', () => {
    describe('when subcategory exists', () => {
      it('should return mapped domain object', async () => {
        const mockSelect = jest.fn().mockReturnValue({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([fakeDbRow]),
          }),
        })
        mockDb.select = mockSelect
        mockDbExpenseSubCategoryToDomain.mockReturnValue(fakeDomainObject)

        const result = await getExpenseSubCategoryByIdRepository(fakeSubCategoryId)

        expect(result).toEqual(fakeDomainObject)
        expect(mockSelect).toHaveBeenCalled()
        expect(mockDbExpenseSubCategoryToDomain).toHaveBeenCalledWith(fakeDbRow)
      })
    })

    describe('when subcategory does not exist', () => {
      it('should return null', async () => {
        const mockSelect = jest.fn().mockReturnValue({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        })
        mockDb.select = mockSelect

        const result = await getExpenseSubCategoryByIdRepository(fakeSubCategoryId)

        expect(result).toBeNull()
        expect(mockDbExpenseSubCategoryToDomain).not.toHaveBeenCalled()
      })
    })

    describe('when database throws an error', () => {
      it('should throw RepositoryError with error details', async () => {
        const fakeDatabaseError = new Error('Database connection failed')
        const mockSelect = jest.fn().mockReturnValue({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockRejectedValue(fakeDatabaseError),
          }),
        })
        mockDb.select = mockSelect

        await expect(getExpenseSubCategoryByIdRepository(fakeSubCategoryId)).rejects.toThrow(
          RepositoryError,
        )

        expect(console.error).toHaveBeenCalledWith(
          `Failed to get expense subcategory with id: ${fakeSubCategoryId}`,
          fakeDatabaseError,
        )
      })
    })
  })
})
