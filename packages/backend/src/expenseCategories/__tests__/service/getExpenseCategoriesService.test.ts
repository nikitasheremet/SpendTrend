import { getExpenseCategoriesService } from '../../service/getExpenseCategoriesService'
import { getExpenseCategoriesRepository } from '../../repository/getExpenseCategoriesRepository'

jest.mock('../../repository/getExpenseCategoriesRepository')

describe('getExpenseCategoriesService', () => {
  const mockGetExpenseCategoriesRepository = getExpenseCategoriesRepository as jest.Mock

  const fakeInput = {
    accountId: 'acc-456',
    userId: 'user-123',
  }

  beforeEach(() => {
    mockGetExpenseCategoriesRepository.mockReset()
  })

  describe('when repository call is successful', () => {
    it('should return expenseCategories', async () => {
      const fakeExpenseCategories = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Groceries',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Utilities',
        },
      ]

      mockGetExpenseCategoriesRepository.mockResolvedValueOnce(fakeExpenseCategories)

      const result = await getExpenseCategoriesService(fakeInput)

      expect(result).toEqual(fakeExpenseCategories)
      expect(mockGetExpenseCategoriesRepository).toHaveBeenCalledWith(fakeInput)
    })
  })

  describe('when repository call fails', () => {
    it('should throw the error', async () => {
      const mockError = new Error('Repository failure')
      mockGetExpenseCategoriesRepository.mockRejectedValueOnce(mockError)

      await expect(getExpenseCategoriesService(fakeInput)).rejects.toThrow('Repository failure')
    })
  })
})
