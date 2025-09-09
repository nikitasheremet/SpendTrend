import { getExpenseCategoriesRepository } from '../../repository/getExpenseCategoriesRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('getExpenseCategoriesRepository', () => {
  const mockSelect = db.select as jest.Mock
  const fakeInput = { accountId: 'a' }

  beforeEach(() => {
    mockSelect.mockReset()
  })

  describe.skip('when query is successful', () => {
    it('should return the mapped rows', async () => {
      const fakeDbRows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'u',
          accountId: 'a',
          name: 'Groceries',
          subcategories: ['Produce'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          userId: 'u',
          accountId: 'a',
          name: 'Utilities',
          subcategories: ['Electricity'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      const fakeMappedRows = fakeDbRows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }))
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => fakeDbRows,
        }),
      })

      const result = await getExpenseCategoriesRepository(fakeInput)
      expect(result).toEqual(fakeMappedRows)
    })
  })

  describe('when db select fails', () => {
    it('should throw RepositoryError with DB_ERROR', async () => {
      mockSelect.mockImplementationOnce(() => {
        throw new Error('select failed')
      })
      const result = getExpenseCategoriesRepository(fakeInput)
      await expect(result).rejects.toThrow(RepositoryError)
      await expect(result).rejects.toThrow(DB_ERROR)
    })
  })
})
