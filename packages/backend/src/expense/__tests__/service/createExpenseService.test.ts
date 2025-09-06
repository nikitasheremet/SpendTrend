import { createExpenseService } from '../../service/createExpenseService'
import * as repository from '../../repository/createExpenseRepository'
import type { Expense } from '../../../models/expense/Expense'
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
    const expense: Expense = {
      id: '1',
      userId: 'user-1',
      accountId: 'account-1',
      name: 'Lunch',
      amount: 10,
      netAmount: 10,
      date: '2023-01-01',
      category: {
        id: 'cat-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Food',
        subcategories: ['Groceries'],
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
      },
      subCategory: 'Dining',
      paidBackAmount: 0,
      createdAt: '2023-01-01T12:00:00Z',
      updatedAt: '2023-01-01T12:00:00Z',
    }
    mockedCreateExpenseRepository.mockResolvedValueOnce(expense)

    // Act
    const result = await createExpenseService(fakeInput)

    // Assert
    expect(result).toEqual(expense)
  })
})
