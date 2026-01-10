import { createIncomeService } from '../../service/createIncomeService'
import { createIncomeRepository } from '../../repository/createIncomeRepository'
import { CreateIncomesInput } from '../../validation/models'

jest.mock('../../repository/createIncomeRepository', () => ({
  createIncomeRepository: jest.fn(),
}))

describe('createIncomeService', () => {
  const mockedCreateIncomeRepository = createIncomeRepository as jest.Mock
  const fakeUserId = 'fake-user-id'
  const fakeAccountId = 'fake-account-id'
  const baseIncomes = [
    { name: 'Salary', amount: 100, date: '2025-08-07' },
    { name: 'Bonus', amount: 50, date: '2025-08-08' },
  ]
  const multipleIncomeInput: CreateIncomesInput = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    incomesToCreate: baseIncomes,
  }

  beforeEach(() => {
    mockedCreateIncomeRepository.mockReset()
  })

  it('should collect failures when repository throws', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateIncomeRepository.mockRejectedValue(error)

    // Act
    const result = await createIncomeService(multipleIncomeInput)

    // Assert
    expect(result.createdIncomes).toEqual([])
    expect(result.failedIncomes).toHaveLength(2)
    expect(result.failedIncomes[0]).toEqual(
      expect.objectContaining({ errorMessage: 'Repository error' }),
    )
  })

  it('should return created incomes from the repository', async () => {
    // Arrange
    const incomeOne = {
      id: '1',
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: baseIncomes[0].name,
      amount: 100,
      date: baseIncomes[0].date,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const incomeTwo = {
      id: '2',
      userId: fakeUserId,
      accountId: fakeAccountId,
      name: baseIncomes[1].name,
      amount: 50,
      date: baseIncomes[1].date,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockedCreateIncomeRepository.mockResolvedValueOnce(incomeOne)
    mockedCreateIncomeRepository.mockResolvedValueOnce(incomeTwo)

    // Act
    const result = await createIncomeService(multipleIncomeInput)

    // Assert
    expect(result.failedIncomes).toEqual([])
    expect(result.createdIncomes).toHaveLength(2)
    expect(result.createdIncomes[0]).toEqual(
      expect.objectContaining({ id: '1', name: baseIncomes[0].name }),
    )
    expect(result.createdIncomes[1]).toEqual(
      expect.objectContaining({ id: '2', name: baseIncomes[1].name }),
    )
  })
})
