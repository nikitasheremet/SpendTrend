import { createIncomeService } from '../../service/createIncomeService'
import { createIncomeRepository } from '../../repository/createIncomeRepository'
import { CreateIncomeInput } from '../../validation/models'

jest.mock('../../repository/createIncomeRepository', () => ({
  createIncomeRepository: jest.fn(),
}))

describe('createIncomeService', () => {
  const mockedCreateIncomeRepository = createIncomeRepository as jest.Mock
  const fakeInput = {} as CreateIncomeInput

  beforeEach(() => {
    mockedCreateIncomeRepository.mockReset()
  })

  it('should throw an error if repository throws', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateIncomeRepository.mockRejectedValueOnce(error)

    // Act & Assert
    await expect(createIncomeService(fakeInput)).rejects.toThrow('Repository error')
  })

  it('should return the data returned from the repository and match type Income', async () => {
    // Arrange
    const income = {
      id: '1',
    }
    mockedCreateIncomeRepository.mockResolvedValueOnce(income)

    // Act
    const result = await createIncomeService(fakeInput)

    // Assert
    expect(result).toEqual(income)
  })
})
