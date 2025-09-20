import { createIncomeRepository, CreateIncome } from '../../repository/createIncomeRepository'
import { db } from '../../../db'
import { excludeFieldsAndAdd } from '../../../utilities/excludeFieldsAndAdd'

jest.mock('../../../db')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('createIncomeRepository', () => {
  const mockDbInsert = db.insert as jest.Mock
  const fakeDbQuery = db.query

  const fakeValidIncome: CreateIncome = {
    userId: 'user-1',
    accountId: 'account-1',
    name: 'Test Income',
    amount: 100,
    date: '2025-08-04',
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      const errorMessage = 'DB error'
      mockDbInsert.mockImplementation(() => {
        throw new Error(errorMessage)
      })
      await expect(createIncomeRepository(fakeValidIncome)).rejects.toThrow(errorMessage)
    })
  })

  describe('when the database successfully inserts a new income', () => {
    it('should return an object of type Income', async () => {

      const fakeDbIncome = {
        ...fakeValidIncome,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockDbInsert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbIncome]),
        }),
      })

      const expectedIncome = fakeDbIncome

      const result = await createIncomeRepository(fakeValidIncome)
      expect(result).toEqual(expectedIncome)
    })
  })
})
