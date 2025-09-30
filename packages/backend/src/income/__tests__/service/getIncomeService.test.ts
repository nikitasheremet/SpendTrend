import { getIncomesService } from '../../service/getIncomesService'
import { getIncomesRepository } from '../../repository/getIncomesRepository'
import { GetIncomesInput } from '../../validation/models'

jest.mock('../../repository/getIncomesRepository', () => ({
  getIncomesRepository: jest.fn(),
}))

describe('getIncomesService', () => {
  const mockedGetIncomesRepository = getIncomesRepository as jest.Mock
  const fakeInput = {
    userId: 'user-1',
    accountId: 'account-1',
  } as GetIncomesInput

  beforeEach(() => {
    mockedGetIncomesRepository.mockReset()
  })

  describe('when repository throws an error', () => {
    it('should throw an error', async () => {
      // Arrange
      const error = new Error('Repository error')
      mockedGetIncomesRepository.mockRejectedValueOnce(error)

      // Act & Assert
      await expect(getIncomesService(fakeInput)).rejects.toThrow('Repository error')
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
      mockedGetIncomesRepository.mockResolvedValueOnce(fakeIncomeList)

      // Act
      const result = await getIncomesService(fakeInput)

      // Assert
      expect(result).toEqual(fakeIncomeList)
    })
  })

  describe('when repository returns empty array', () => {
    it('should return empty array', async () => {
      // Arrange
      mockedGetIncomesRepository.mockResolvedValueOnce([])

      // Act
      const result = await getIncomesService(fakeInput)

      // Assert
      expect(result).toEqual([])
    })
  })
})
