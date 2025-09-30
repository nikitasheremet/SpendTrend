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
        },
      ]
      mockedGetIncomeRepository.mockResolvedValueOnce(fakeIncomeList)

      // Act
      const result = await getIncomeService(fakeInput)

      // Assert
      expect(result).toEqual(fakeIncomeList)
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
    })
  })
})