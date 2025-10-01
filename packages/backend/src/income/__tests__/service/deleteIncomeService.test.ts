import { deleteIncomeService } from '../../service/deleteIncomeService'
import * as repository from '../../repository/deleteIncomeRepository'

jest.mock('../../repository/deleteIncomeRepository', () => ({
  deleteIncomeRepository: jest.fn(),
}))

describe('deleteIncomeService', () => {
  const mockDeleteIncomeRepository = repository.deleteIncomeRepository as jest.Mock
  const fakeInput = { id: 'income-1' }

  beforeEach(() => {
    mockDeleteIncomeRepository.mockReset()
  })

  describe('when the repository function throws an error', () => {
    it('should return an error', async () => {
      const fakeError = new Error('Repository error')
      mockDeleteIncomeRepository.mockRejectedValueOnce(fakeError)

      const deleteIncomeServicePromise = deleteIncomeService(fakeInput)

      await expect(deleteIncomeServicePromise).rejects.toThrow(fakeError)
    })
  })

  describe('when the repository function returns an income', () => {
    it('should return the same income', async () => {
      const fakeIncome = { id: '1', name: 'Salary', amount: 5000 }
      mockDeleteIncomeRepository.mockResolvedValueOnce(fakeIncome)

      const result = await deleteIncomeService(fakeInput)

      expect(result).toEqual(fakeIncome)
    })
  })
})
