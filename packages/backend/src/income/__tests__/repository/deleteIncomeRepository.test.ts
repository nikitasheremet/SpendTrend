import { deleteIncomeRepository, DeleteIncome } from '../../repository/deleteIncomeRepository'
import { db } from '../../../db'
import { DB_ERROR, NOT_FOUND_ERROR } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('deleteIncomeRepository', () => {
  const mockDbDelete = db.delete as jest.Mock

  const fakeValidIncome: DeleteIncome = {
    id: 'income-1',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      mockDbDelete.mockImplementation(() => {
        throw new Error(DB_ERROR)
      })
      await expect(deleteIncomeRepository(fakeValidIncome)).rejects.toThrow(DB_ERROR)
    })
  })

  describe('when income is not found', () => {
    it('should throw a NOT_FOUND_ERROR', async () => {
      mockDbDelete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      })

      await expect(deleteIncomeRepository(fakeValidIncome)).rejects.toThrow(NOT_FOUND_ERROR)
    })
  })

  describe('when the database deletes an income', () => {
    it('should return an object of type Income', async () => {
      const fakeDeletedIncome = {
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Income',
        amount: 100,
        date: '2025-08-04',
        id: fakeValidIncome.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDbDelete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDeletedIncome]),
        }),
      })

      const expectedDeletedIncome = fakeDeletedIncome

      const result = await deleteIncomeRepository(fakeValidIncome)
      expect(result).toEqual(expectedDeletedIncome)
    })
  })
})
