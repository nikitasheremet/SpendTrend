import { deleteExpenseRepository, DeleteExpense } from '../../repository/deleteExpenseRepository'
import { db } from '../../../db'
import { DB_ERROR } from '../../../models/errors/repositoryErrors'


jest.mock('../../../db')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('deleteExpensesRepository', () => {
  const mockDbInsert = db.insert as jest.Mock
  const mockDbDelete = db.delete as jest.Mock
  const fakeDbQuery = db.query

  const fakeValidExpense: DeleteExpense = {
    id: 'expense-1',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      mockDbInsert.mockImplementation(() => {
        throw new Error(DB_ERROR)
      })
      await expect(deleteExpenseRepository(fakeValidExpense)).rejects.toThrow(DB_ERROR)
    })
  })

  describe('when the database deletes an expense', () => {
    it('should return an object of type Expense', async () => {
      // Arrange
      const fakeDeletedExpense = {
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Test Expense',
        amount: 100,
        netAmount: 90,
        date: '2025-08-04',
        categoryId: '1',
        subCategoryId: '1',
        paidBackAmount: 0,
        id: fakeValidExpense.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDbDelete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDeletedExpense]),
        }),
      })

      const fakeExpenseSubCategory = {
        id: '1',
        userId: 'user-1',
        accountId: 'account-1',
        categoryId: '1',
        name: 'Groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const fakeExpenseCategoryQueryResponse = {
        id: '1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Food',
        subCategories: [fakeExpenseSubCategory],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      fakeDbQuery.expenseCategoriesTable.findFirst = jest
        .fn()
        .mockResolvedValue(fakeExpenseCategoryQueryResponse)

      // Act
      const result = await deleteExpenseRepository({ id: fakeValidExpense.id })

      // Assert
      expect(result).toEqual({
        id: fakeDeletedExpense.id,
        userId: fakeDeletedExpense.userId,
        accountId: fakeDeletedExpense.accountId,
        name: fakeDeletedExpense.name,
        amount: fakeDeletedExpense.amount,
        netAmount: fakeDeletedExpense.netAmount,
        date: fakeDeletedExpense.date,
        category: {
          id: '1',
          userId: fakeExpenseCategoryQueryResponse.userId,
          accountId: fakeExpenseCategoryQueryResponse.accountId,
          name: fakeExpenseCategoryQueryResponse.name,
          subCategories: [
            {
              ...fakeExpenseSubCategory,
              createdAt: fakeExpenseSubCategory.createdAt.toISOString(),
              updatedAt: fakeExpenseSubCategory.updatedAt.toISOString(),
            },
          ],
          createdAt: fakeExpenseCategoryQueryResponse.createdAt.toISOString(),
          updatedAt: fakeExpenseCategoryQueryResponse.updatedAt.toISOString(),
        },
        subCategory: {
          ...fakeExpenseSubCategory,
          createdAt: fakeExpenseSubCategory.createdAt.toISOString(),
          updatedAt: fakeExpenseSubCategory.updatedAt.toISOString(),
        },
        paidBackAmount: fakeDeletedExpense.paidBackAmount,
        createdAt: fakeDeletedExpense.createdAt.toISOString(),
        updatedAt: fakeDeletedExpense.updatedAt.toISOString(),
      })
    })
  })
})
