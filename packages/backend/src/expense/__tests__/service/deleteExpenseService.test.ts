import { deleteExpenseService } from '../../service/deleteExpenseService'
import * as repository from '../../repository/deleteExpenseRepository'

jest.mock('../../repository/deleteExpenseRepository', () => ({
  deleteExpenseRepository: jest.fn(),
}))

describe('deleteExpensesService', () => {
  const mockDeleteExpensesRepository = repository.deleteExpenseRepository as jest.Mock
  const fakeInput = { expenseId: 'expense-1' }

  beforeEach(() => {
    mockDeleteExpensesRepository.mockReset()
  })

  describe('when the repository function throws an error', () => {
    it('should return an error', async () => {
      // Arrange
      const fakeError = new Error('Repository error')
      mockDeleteExpensesRepository.mockRejectedValueOnce(fakeError)

      // Act
      const deleteExpensesServicePromise = deleteExpenseService(fakeInput)

      // Assert
      await expect(deleteExpensesServicePromise).rejects.toThrow(fakeError)
    })
  })

  describe('when the repository function returns an expense', () => {
    it('should return the same expense', async () => {
      // Arrange
      const fakeExpense = { id: '1', name: 'Groceries', amount: 100 }
      mockDeleteExpensesRepository.mockResolvedValueOnce(fakeExpense)

      // Act
      const result = await deleteExpenseService(fakeInput)

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          ...fakeExpense,
          amount: 1.0,
        }),
      )
    })
  })
})
