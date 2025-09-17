import { createExpenseSubCategoryRepository } from '../../repository/createExpenseSubCategoryRepository'
import { db } from '../../../db'
import { dbExpenseSubCategoryToDomain } from '../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db', () => ({
  db: {
    insert: jest.fn(),
  },
}))

jest.mock('../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain')

describe('createExpenseSubCategoryRepository', () => {
  const mockDb = db as jest.Mocked<typeof db>
  const mockDbExpenseSubCategoryToDomain = dbExpenseSubCategoryToDomain as jest.Mock

  const mockInsert = {
    values: jest.fn(),
  }
  const mockValues = {
    returning: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockDb.insert.mockReturnValue(mockInsert as any)
    mockInsert.values.mockReturnValue(mockValues as any)
  })

  const validInput = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
  }

  const mockDbSubCategory = {
    id: '00000000-0000-4000-8000-000000000003',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockDomainSubCategory = {
    id: '00000000-0000-4000-8000-000000000003',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('when database operation succeeds', () => {
    it('should insert subCategory and return mapped domain object', async () => {
      mockValues.returning.mockResolvedValue([mockDbSubCategory])
      mockDbExpenseSubCategoryToDomain.mockReturnValue(mockDomainSubCategory)

      const result = await createExpenseSubCategoryRepository(validInput)

      expect(result).toEqual(mockDomainSubCategory)
    })
  })

  describe('when database operation fails', () => {
    it('should throw a RepositoryError', async () => {
      const dbError = new Error('Database connection failed')
      mockValues.returning.mockRejectedValue(dbError)

      await expect(createExpenseSubCategoryRepository(validInput)).rejects.toThrow(RepositoryError)
      await expect(createExpenseSubCategoryRepository(validInput)).rejects.toThrow(DB_ERROR)
    })
  })
})
