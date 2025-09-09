import { createExpenseService } from '../../service/createExpenseService'
import * as repository from '../../repository/createExpenseRepository'
import { CreateExpenseInput } from '../../validation/models'

jest.mock('../../repository/createExpenseRepository', () => ({
  createExpenseRepository: jest.fn(),
}))

const fakeInput = {} as CreateExpenseInput

describe('createExpenseService', () => {
  const mockedCreateExpenseRepository = repository.createExpenseRepository as jest.Mock

  beforeEach(() => {
    mockedCreateExpenseRepository.mockReset()
  })

  it('should throw an error if repository throws', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateExpenseRepository.mockRejectedValueOnce(error)

    // Act & Assert
    await expect(createExpenseService(fakeInput)).rejects.toThrow('Repository error')
  })

  it('should return the data returned from the repository and match type Expense', async () => {
    // Arrange
    const expense = {
      id: '1',
    }
    mockedCreateExpenseRepository.mockResolvedValueOnce(expense)

    // Act
    const result = await createExpenseService(fakeInput)

    // Assert
    expect(result).toEqual(expense)
  })
})
