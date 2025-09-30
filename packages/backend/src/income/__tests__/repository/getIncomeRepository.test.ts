import { getIncomeRepository, GetIncomeQuery } from '../../repository/getIncomeRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('getIncomeRepository', () => {
  const mockDbSelect = db.select as jest.Mock
  
  const fakeQuery: GetIncomeQuery = {
    accountId: 'account-1',
  }

  let fromMock: jest.Mock
  let whereMock: jest.Mock
  let orderByMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    // create the chain for select: select().from(...).where(...).orderBy(...)
    orderByMock = jest.fn()
    whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock })
    fromMock = jest.fn().mockReturnValue({ where: whereMock })
    mockDbSelect.mockReturnValue({ from: fromMock })
  })

  describe('when the database throws an error', () => {
    it('should throw a repository error', async () => {
      const errorMessage = 'DB error'
      mockDbSelect.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      await expect(getIncomeRepository(fakeQuery)).rejects.toThrow(DB_ERROR)
      await expect(getIncomeRepository(fakeQuery)).rejects.toBeInstanceOf(RepositoryError)
    })
  })

  describe('when the database returns an array of income records', () => {
    it('should return mapped income records ordered by date desc', async () => {
      const fakeDbIncomeRecords = [
        {
          id: 'income-1',
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Salary',
          amount: 5000,
          date: '2023-12-01',
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2023-12-01'),
        },
        {
          id: 'income-2',
          userId: 'user-1',
          accountId: 'account-1',
          name: 'Bonus',
          amount: 1000,
          date: '2023-11-01',
          createdAt: new Date('2023-11-01'),
          updatedAt: new Date('2023-11-01'),
        },
      ]

      orderByMock.mockResolvedValue(fakeDbIncomeRecords)

      const result = await getIncomeRepository(fakeQuery)

      expect(result).toEqual(fakeDbIncomeRecords)
      expect(result).toHaveLength(2)
    })
  })

  describe('when the database returns an empty array', () => {
    it('should return an empty array', async () => {
      orderByMock.mockResolvedValue([])

      const result = await getIncomeRepository(fakeQuery)

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })
})