import { createExpenseService } from '../../service/createExpenseService'
import * as repository from '../../repository/createExpenseRepository'
import { CreateExpenseInput } from '../../validation/models'

jest.mock('../../repository/createExpenseRepository', () => ({
  createExpenseRepository: jest.fn(),
}))

const fakeInput = {
  amount: 10.5,
  netAmount: 9.5,
  paidBackAmount: 5.0,
} as CreateExpenseInput

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
      amount: 1050,
      netAmount: 950,
      paidBackAmount: 500,
    }
    mockedCreateExpenseRepository.mockResolvedValueOnce(expense)

    // Act
    const result = await createExpenseService(fakeInput)

    // Assert
    expect(result).toEqual({
      ...expense,
      amount: 10.5,
      netAmount: 9.5,
      paidBackAmount: 5.0,
    })
  })
})
