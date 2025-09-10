import { createExpenseSubcategoryRepository } from '../../repository/createExpenseSubcategoryRepository'
import { db } from '../../../db'
import { expenseSubCategoriesTable } from '../../../db/schema'
import { dbExpenseSubCategoryToDomain } from '../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain'
import { RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db', () => ({
  db: {
    insert: jest.fn(),
  },
}))

jest.mock('../../../utilities/mappers/expenseSubCategory/dbExpenseSubCategoryToDomain')

describe('createExpenseSubcategoryRepository', () => {
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

  const mockDbSubcategory = {
    id: '00000000-0000-4000-8000-000000000003',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockDomainSubcategory = {
    id: '00000000-0000-4000-8000-000000000003',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    categoryId: '00000000-0000-4000-8000-000000000002',
    name: 'Test Subcategory',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('when database operation succeeds', () => {
    it('should insert subcategory and return mapped domain object', async () => {
      mockValues.returning.mockResolvedValue([mockDbSubcategory])
      mockDbExpenseSubCategoryToDomain.mockReturnValue(mockDomainSubcategory)

      const result = await createExpenseSubcategoryRepository(validInput)

      expect(mockDb.insert).toHaveBeenCalledWith(expenseSubCategoriesTable)
      expect(mockInsert.values).toHaveBeenCalledWith({
        userId: validInput.userId,
        accountId: validInput.accountId,
        categoryId: validInput.categoryId,
        name: validInput.name,
      })
      expect(mockValues.returning).toHaveBeenCalled()
      expect(mockDbExpenseSubCategoryToDomain).toHaveBeenCalledWith(mockDbSubcategory)
      expect(result).toEqual(mockDomainSubcategory)
    })
  })

  describe('when database operation fails', () => {
    it('should throw a RepositoryError', async () => {
      const dbError = new Error('Database connection failed')
      mockValues.returning.mockRejectedValue(dbError)

      await expect(createExpenseSubcategoryRepository(validInput)).rejects.toThrow(RepositoryError)
      await expect(createExpenseSubcategoryRepository(validInput)).rejects.toThrow(
        'Database Error: Failed to create expense subcategory. Error: Database connection failed',
      )
    })
  })
})
