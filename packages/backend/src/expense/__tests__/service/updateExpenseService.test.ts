import { updateExpenseService } from '../../service/updateExpenseService'
import { updateExpenseRepository } from '../../repository/updateExpenseRepository'
import { UpdateExpenseInput } from '../../validation/models'

vi.mock('../../repository/updateExpenseRepository', () => ({
  updateExpenseRepository: vi.fn(),
}))

describe('updateExpenseService', () => {
  const mockedUpdateExpenseRepository = updateExpenseRepository as Mock
  const fakeInput = {} as UpdateExpenseInput

  beforeEach(() => {
    vi.resetAllMocks()
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
    expect(result).toEqual(expect.objectContaining({ ...fakeRepoResult, amount: 3.0 }))
  })

  it('should recalculate netAmount from amount and paidBackAmount', async () => {
    // Arrange
    const input = {
      id: 'abc',
      userId: 'u1',
      accountId: 'a1',
      amount: 10.0,
      paidBackAmount: 3.0,
      netAmount: 99.99, // stale value — should be ignored
    } as UpdateExpenseInput
    const fakeRepoResult = { id: 'abc', amount: 1000, paidBackAmount: 300, netAmount: 700 }
    mockedUpdateExpenseRepository.mockResolvedValueOnce(fakeRepoResult)

    // Act
    await updateExpenseService(input)

    // Assert
    expect(mockedUpdateExpenseRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldsToUpdate: expect.objectContaining({
          amount: 1000,
          paidBackAmount: 300,
          netAmount: 700,
        }),
      }),
    )
  })

  it('should not overwrite netAmount when amount is not provided', async () => {
    // Arrange
    const input = {
      id: 'abc',
      userId: 'u1',
      accountId: 'a1',
      paidBackAmount: 2.0,
      // amount is undefined — cannot recalculate
    } as UpdateExpenseInput
    const fakeRepoResult = { id: 'abc', paidBackAmount: 200 }
    mockedUpdateExpenseRepository.mockResolvedValueOnce(fakeRepoResult)

    // Act
    await updateExpenseService(input)

    // Assert
    expect(mockedUpdateExpenseRepository).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldsToUpdate: expect.not.objectContaining({ netAmount: expect.anything() }),
      }),
    )
  })
})
