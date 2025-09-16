import { getExpenseCategoriesRepository } from '../../repository/getExpenseCategoriesRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('getExpenseCategoriesRepository', () => {
  const mockQuery = { expenseCategoriesTable: { findMany: jest.fn() } }
  const fakeInput = { accountId: 'a' }

  beforeEach(() => {
    jest.resetAllMocks()
    // @ts-expect-error - mocking db.query
    db.query = mockQuery
  })

  describe('when query is successful', () => {
    it('should return the mapped rows', async () => {
      const fakeSubCategories = [
        {
          id: 'sub-123',
          userId: 'u',
          accountId: 'a',
          name: 'Produce',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'sub-456',
          userId: 'u',
          accountId: 'a',
          name: 'Electricity',
          categoryId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const fakeDbRows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'u',
          accountId: 'a',
          name: 'Groceries',
          subCategories: [fakeSubCategories[0]],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          userId: 'u',
          accountId: 'a',
          name: 'Utilities',
          subCategories: [fakeSubCategories[1]],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockQuery.expenseCategoriesTable.findMany.mockResolvedValueOnce(fakeDbRows)

      const result = await getExpenseCategoriesRepository(fakeInput)

      expect(result).toHaveLength(2)
      const expected = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'u',
          accountId: 'a',
          name: 'Groceries',
          subCategories: [
            {
              id: 'sub-123',
              userId: 'u',
              accountId: 'a',
              name: 'Produce',
              categoryId: '123e4567-e89b-12d3-a456-426614174000',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          userId: 'u',
          accountId: 'a',
          name: 'Utilities',
          subCategories: [
            {
              id: 'sub-456',
              userId: 'u',
              accountId: 'a',
              name: 'Electricity',
              categoryId: '123e4567-e89b-12d3-a456-426614174001',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]

      expect(result).toEqual(expected)
    })
  })

  describe('when db query fails', () => {
    it('should throw RepositoryError with DB_ERROR', async () => {
      mockQuery.expenseCategoriesTable.findMany.mockRejectedValueOnce(new Error('query failed'))

      const result = getExpenseCategoriesRepository(fakeInput)
      await expect(result).rejects.toThrow(RepositoryError)
      await expect(result).rejects.toThrow(DB_ERROR)
    })
  })
})
