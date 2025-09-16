import { createIncomeService } from '../../service/createIncomeService'
import * as repository from '../../repository/createIncomeRepository'
import { CreateIncomeInput } from '../../validation/models'

jest.mock('../../repository/createIncomeRepository', () => ({
  createIncomeRepository: jest.fn(),
}))

const fakeInput = {} as CreateIncomeInput

describe('createIncomeService', () => {
  const mockedCreateIncomeRepository = repository.createIncomeRepository as jest.Mock

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
