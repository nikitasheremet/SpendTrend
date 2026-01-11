import { createExpenseService } from '../../service/createExpenseService'
import * as repository from '../../repository/createExpenseRepository'
import { CreateExpensesInput } from '../../validation/models'
import { object } from 'zod'

jest.mock('../../repository/createExpenseRepository', () => ({
  createExpenseRepository: jest.fn(),
}))

const fakeInput = {
  expensesToCreate: [
    {
      amount: 10.5,
      netAmount: 9.5,
      paidBackAmount: 5.0,
    },
  ],
} as CreateExpensesInput

describe('createExpenseService', () => {
  const mockedCreateExpenseRepository = repository.createExpenseRepository as jest.Mock

  beforeEach(() => {
    mockedCreateExpenseRepository.mockReset()
  })

  it('should return the failures under failedExpenses', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateExpenseRepository.mockRejectedValueOnce(error)

    // Act & Assert
    const result = await createExpenseService(fakeInput)
    expect(result).toEqual({
      createdExpenses: [],
      failedExpenses: [
        expect.objectContaining({
          errorMessage: 'Repository error',
        }),
      ],
    })
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
      createdExpenses: [
        {
          id: '1',
          amount: 10.5,
          netAmount: 9.5,
          paidBackAmount: 5.0,
        },
      ],
      failedExpenses: [],
    })
  })
})
