import { updateIncomeService } from '../../service/updateIncomeService'
import { updateIncomeRepository } from '../../repository/updateIncomeRepository'
import { UpdateIncomeInput } from '../../validation/models'

jest.mock('../../repository/updateIncomeRepository', () => ({
  updateIncomeRepository: jest.fn(),
}))

describe('updateIncomeService', () => {
  const mockedUpdateIncomeRepository = updateIncomeRepository as jest.Mock
  const fakeInput = {} as UpdateIncomeInput

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when repository throws', () => {
    it('should throw an error', async () => {
      // Arrange
      const fakeError = new Error('Repository error')
      mockedUpdateIncomeRepository.mockRejectedValueOnce(fakeError)

      // Act & Assert
      await expect(updateIncomeService(fakeInput)).rejects.toThrow('Repository error')
    })
  })

  it('should return the same object the repository returns', async () => {
    // Arrange
    const fakeRepoResult = { id: 'abc', name: 'Salary', amount: 5000 }
    mockedUpdateIncomeRepository.mockResolvedValueOnce(fakeRepoResult)

    // Act
    const result = await updateIncomeService(fakeInput)

    // Assert
    expect(result).toEqual(fakeRepoResult)
  })
})
