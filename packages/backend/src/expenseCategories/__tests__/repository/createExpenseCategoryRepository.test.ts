import { createExpenseCategoryRepository } from '../../repository/createExpenseCategoryRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('when createExpenseCategoryRepository is called', () => {
  const mockInsert = db.insert as jest.Mock
  const fakeInput = { userId: 'u', accountId: 'a', name: 'n', subcategories: [] }

  beforeEach(() => {
    mockInsert.mockReset()
  })

  describe.skip('when expenseCategory is created successfully', () => {
    it('should return created expenseCategory', async () => {
      const returnedDbRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...fakeInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockInsert.mockReturnValueOnce({ values: () => ({ returning: () => [returnedDbRow] }) })

      const result = await createExpenseCategoryRepository(fakeInput)
      expect(result).toEqual({
        id: returnedDbRow.id,
        userId: returnedDbRow.userId,
        accountId: returnedDbRow.accountId,
        name: returnedDbRow.name,
        subcategories: returnedDbRow.subcategories,
        createdAt: returnedDbRow.createdAt.toISOString(),
        updatedAt: returnedDbRow.updatedAt.toISOString(),
      })
    })
  })

  describe('when db insert fails', () => {
    it('should return failure message with DB_ERROR', async () => {
      mockInsert.mockImplementationOnce(() => {
        throw new Error('insert failed')
      })
      const result = createExpenseCategoryRepository(fakeInput)
      await expect(result).rejects.toThrow(RepositoryError)
      await expect(result).rejects.toThrow(DB_ERROR)
    })
  })
})
