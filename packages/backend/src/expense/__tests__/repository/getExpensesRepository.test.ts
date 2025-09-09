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
      const fakeExpenseSubCategory = {
        id: 'subcategory-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Groceries',
        categoryId: 'category-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const fakeExpenseCategory = {
        id: 'category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Food',
        subCategories: [fakeExpenseSubCategory],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const fakeDbExpense = {
        id: '1',
        accountId: fakeAccountId,
        userId: 'user-1',
        name: 'Groceries',
        amount: 100,
        netAmount: 90,
        date: '2025-08-04',
        category: fakeExpenseCategory,
        subCategoryId: 'subcategory-1',
        paidBackAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const expectedExpenses = [
        {
          id: '1',
          accountId: fakeAccountId,
          userId: 'user-1',
          name: 'Groceries',
          amount: 100,
          netAmount: 90,
          date: '2025-08-04',
          paidBackAmount: 0,
          category: {
            ...fakeDbExpense.category,
            subCategories: fakeDbExpense.category.subCategories.map((sub) => ({
              ...sub,
              createdAt: sub.createdAt.toISOString(),
              updatedAt: sub.updatedAt.toISOString(),
            })),
            createdAt: fakeDbExpense.category.createdAt.toISOString(),
            updatedAt: fakeDbExpense.category.updatedAt.toISOString(),
          },
          subCategory: {
            ...fakeExpenseSubCategory,
            createdAt: fakeExpenseSubCategory.createdAt.toISOString(),
            updatedAt: fakeExpenseSubCategory.updatedAt.toISOString(),
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
