import { getExpensesService } from '../../service/getExpensesService'
import * as repository from '../../repository/getExpensesRepository'

jest.mock('../../repository/getExpensesRepository', () => ({
  getExpensesRepository: jest.fn(),
}))

describe('getExpensesService', () => {
  const mockGetExpensesRepository = repository.getExpensesRepository as jest.Mock
  const fakeInput = { accountId: 'account-1' }

  beforeEach(() => {
    mockGetExpensesRepository.mockReset()
  })

  describe('when the repository function throws an error', () => {
    it('should return an error', async () => {
      // Arrange
      const fakeError = new Error('Repository error')
      mockGetExpensesRepository.mockRejectedValueOnce(fakeError)

      // Act
      const getExpensesServicePromise = getExpensesService(fakeInput)

      // Assert
      await expect(getExpensesServicePromise).rejects.toThrow(fakeError)
    })
  })

  describe('when the repository function returns an array of expenses', () => {
    it('should return the same array', async () => {
      // Arrange
      const fakeExpenses = [
        { id: '1', name: 'Groceries', amount: 100 },
        { id: '2', name: 'Gas', amount: 50 },
      ]
      mockGetExpensesRepository.mockResolvedValueOnce(fakeExpenses)

      // Act
      const result = await getExpensesService(fakeInput)

      // Assert
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...fakeExpenses[0],
            amount: 1.0,
          }),
          expect.objectContaining({
            ...fakeExpenses[1],
            amount: 0.5,
          }),
        ]),
      )
    })
  })
})
