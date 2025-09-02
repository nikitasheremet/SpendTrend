import { updateExpenseService } from '../../service/updateExpenseService'
import { updateExpenseRepository } from '../../repository/updateExpenseRepository'
import { UpdateExpenseInput } from '../../validation/models'

jest.mock('../../repository/updateExpenseRepository', () => ({
  updateExpenseRepository: jest.fn(),
}))

describe('updateExpenseService', () => {
  const mockedUpdateExpenseRepository = updateExpenseRepository as jest.Mock
  const fakeInput = {} as UpdateExpenseInput

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when repository throws', () => {
    it('should throw an error', async () => {
      // Arrange
      const fakeError = new Error('Repository error')
      mockedUpdateExpenseRepository.mockRejectedValueOnce(fakeError)

      // Act & Assert
      await expect(updateExpenseService(fakeInput)).rejects.toThrow('Repository error')
    })
  })

  it('should return the same object the repository returns', async () => {
    // Arrange
    const fakeRepoResult = { id: 'abc', name: 'Coffee', amount: 300 }
    mockedUpdateExpenseRepository.mockResolvedValueOnce(fakeRepoResult)

    // Act
    const result = await updateExpenseService(fakeInput)

    // Assert
    expect(result).toEqual(fakeRepoResult)
  })
})
