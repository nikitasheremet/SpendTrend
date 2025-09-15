import { createExpenseCategoryRepository } from '../../repository/createExpenseCategoryRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')

describe('when createExpenseCategoryRepository is called', () => {
  const mockInsert = db.insert as jest.Mock
  const fakeInput = { userId: 'u', accountId: 'a', name: 'n' }

  beforeEach(() => {
    mockInsert.mockReset()
  })

  describe('when expenseCategory is created successfully', () => {
    it('should return created expenseCategory with empty subcategories array', async () => {
      // Mock the database insert response
      const returnedDbRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...fakeInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockInsert.mockReturnValueOnce({ values: () => ({ returning: () => [returnedDbRow] }) })

      const result = await createExpenseCategoryRepository(fakeInput)

      // Verify the insert was called with the correct input
      expect(mockInsert).toHaveBeenCalledTimes(1)

      // Verify the response includes the category with empty subcategories array
      expect(result).toEqual({
        id: returnedDbRow.id,
        userId: returnedDbRow.userId,
        accountId: returnedDbRow.accountId,
        name: returnedDbRow.name,
        subCategories: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('when db operations fail', () => {
    it('should return failure message with DB_ERROR when insert fails', async () => {
      mockInsert.mockImplementationOnce(() => {
        throw new Error('insert failed')
      })

      const result = createExpenseCategoryRepository(fakeInput)
      await expect(result).rejects.toThrow(RepositoryError)
      await expect(result).rejects.toThrow(DB_ERROR)
    })
  })
})
