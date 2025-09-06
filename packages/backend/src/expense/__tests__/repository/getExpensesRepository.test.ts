import { getExpensesRepository } from '../../repository/getExpensesRepository'
import { db } from '../../../db'
import { DB_ERROR } from '../../../models/errors/repositoryErrors'

jest.mock('../../../db')
// Mocking console error to prevent actual logging during tests
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('getExpensesRepository', () => {
  const mockDbFindMany = db.query.expensesTable.findMany as jest.Mock
  const fakeAccountId = 'account-1'

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      // Arrange
      const errorMessage = 'DB error'
      mockDbFindMany.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      // Act & Assert
      await expect(getExpensesRepository({ accountId: fakeAccountId })).rejects.toThrow(DB_ERROR)
    })
  })

  describe('when the database returns an array of expenses', () => {
    it('should map the results to the Expense domain type', async () => {
      // Arrange
      const fakeExpenseCategory = {
        id: 'category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Food',
        subcategories: ['Groceries'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const fakeDbExpense = {
        id: '1',
        accountId: fakeAccountId,
        name: 'Groceries',
        amount: 100,
        netAmount: 90,
        date: '2025-08-04',
        category: fakeExpenseCategory,
        subCategory: 'Groceries',
        paidBackAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const expectedExpenses = [
        {
          ...fakeDbExpense,
          category: {
            ...fakeDbExpense.category,
            createdAt: fakeDbExpense.category.createdAt.toISOString(),
            updatedAt: fakeDbExpense.category.updatedAt.toISOString(),
          },
          createdAt: fakeDbExpense.createdAt.toISOString(),
          updatedAt: fakeDbExpense.updatedAt.toISOString(),
        },
      ]

      mockDbFindMany.mockResolvedValueOnce([fakeDbExpense])

      // Act
      const result = await getExpensesRepository({ accountId: fakeAccountId })

      // Assert
      expect(result).toEqual(expectedExpenses)
    })
  })
})
