import {
  updateIncomeRepository,
  UpdateIncomeRepository,
} from '../../repository/updateIncomeRepository'
import { db } from '../../../db'
import { RepositoryError, NOT_FOUND_ERROR } from '../../../models/errors/repositoryErrors'
import { IncomeDbRow } from '../../../models/income/income'

jest.mock('../../../db')

describe('updateIncomeRepository', () => {
  const mockDbUpdate = db.update as jest.Mock

  const fakeInput: UpdateIncomeRepository = {
    id: 'income-1',
    fieldsToUpdate: { name: 'New name' },
  }

  let returningMock: jest.Mock
  let whereMock: jest.Mock
  let setMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    // create the chain used by the repository: update(...).set(...).where(...).returning()
    returningMock = jest.fn()
    whereMock = jest.fn().mockReturnValue({ returning: returningMock })
    setMock = jest.fn().mockReturnValue({ where: whereMock })
    mockDbUpdate.mockReturnValue({ set: setMock })
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      const errorMessage = 'DB update error'
      mockDbUpdate.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      await expect(updateIncomeRepository(fakeInput)).rejects.toThrow(errorMessage)
    })
  })

  describe('when the database update succeeds', () => {
    it('should return an Income object', async () => {
      const fakeDbIncome: IncomeDbRow = {
        id: 'income-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Salary',
        amount: 5000,
        date: '2025-08-23',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      returningMock.mockResolvedValueOnce([fakeDbIncome])

      const expectedUpdatedIncome = {
        id: fakeDbIncome.id,
        userId: fakeDbIncome.userId,
        accountId: fakeDbIncome.accountId,
        name: fakeDbIncome.name,
        amount: fakeDbIncome.amount,
        date: fakeDbIncome.date,
        createdAt: fakeDbIncome.createdAt,
        updatedAt: fakeDbIncome.updatedAt,
      }

      const result = await updateIncomeRepository(fakeInput)

      expect(result).toEqual(expectedUpdatedIncome)
    })
  })

  describe('when the database returning returns an empty array', () => {
    it('should throw a repository error indicating no income could be found', async () => {
      const fakeNoIncomesUpdated = [] as IncomeDbRow[]
      returningMock.mockResolvedValueOnce(fakeNoIncomesUpdated)

      const promise = updateIncomeRepository(fakeInput)
      await expect(promise).rejects.toThrow(NOT_FOUND_ERROR)
      await expect(promise).rejects.toBeInstanceOf(RepositoryError)
    })
  })
})
