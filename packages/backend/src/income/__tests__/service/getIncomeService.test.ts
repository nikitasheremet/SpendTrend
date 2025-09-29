import { getIncomeService } from '../../service/getIncomeService'
import { getIncomeRepository } from '../../repository/getIncomeRepository'
import { GetIncomeInput } from '../../validation/models'

jest.mock('../../repository/getIncomeRepository', () => ({
  getIncomeRepository: jest.fn(),
}))

describe('getIncomeService', () => {
  const mockedGetIncomeRepository = getIncomeRepository as jest.Mock
  const fakeInput = {
    userId: 'user-1',
    accountId: 'account-1',
  } as GetIncomeInput

  beforeEach(() => {
    mockedGetIncomeRepository.mockReset()
  })

  describe('when repository throws an error', () => {
    it('should throw an error', async () => {
      // Arrange
      const error = new Error('Repository error')
      mockedGetIncomeRepository.mockRejectedValueOnce(error)

      // Act & Assert
      await expect(getIncomeService(fakeInput)).rejects.toThrow('Repository error')
    })
  })

  describe('when repository returns data', () => {
    it('should return the data returned from the repository', async () => {
      // Arrange
      const fakeIncomeList = [
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
      mockedGetIncomeRepository.mockResolvedValueOnce(fakeIncomeList)

      // Act
      const result = await getIncomeService(fakeInput)

      // Assert
      expect(result).toEqual(fakeIncomeList)
      expect(mockedGetIncomeRepository).toHaveBeenCalledWith({ accountId: fakeInput.accountId })
    })
  })

  describe('when repository returns empty array', () => {
    it('should return empty array', async () => {
      // Arrange
      mockedGetIncomeRepository.mockResolvedValueOnce([])

      // Act
      const result = await getIncomeService(fakeInput)

      // Assert
      expect(result).toEqual([])
      expect(mockedGetIncomeRepository).toHaveBeenCalledWith({ accountId: fakeInput.accountId })
    })
  })
})