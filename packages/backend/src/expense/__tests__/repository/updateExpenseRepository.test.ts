import {
  updateExpenseRepository,
  UpdateExpenseRepository,
} from '../../repository/updateExpenseRepository'
import { db } from '../../../db'
import { RepositoryError, NOT_FOUND_ERROR } from '../../../models/errors/repositoryErrors'
import { ExpensesDbRow } from '../../../models/expense/Expense'
import { ExpenseSubCategoryDbRow } from '../../../models/expenseSubCategory/expenseSubCategory'

jest.mock('../../../db')

describe('updateExpenseRepository', () => {
  const mockDbUpdate = db.update as jest.Mock
  const mockDbQuery = db.query

  const fakeInput: UpdateExpenseRepository = {
    id: 'expense-1',
    fieldsToUpdate: { name: 'New name' },
  }

  let returningMock: jest.Mock
  let whereMock: jest.Mock
  let setMock: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    // create the chain used by the repository: update(...).set(...).where(...).returning()
    returningMock = jest.fn()
    whereMock = jest.fn().mockReturnValue({ returning: returningMock })
    setMock = jest.fn().mockReturnValue({ where: whereMock })
    mockDbUpdate.mockReturnValue({ set: setMock })
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      const errorMessage = 'DB update error'
      mockDbUpdate.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      await expect(updateExpenseRepository(fakeInput)).rejects.toThrow(errorMessage)
    })
  })

  describe('when the database update succeeds', () => {
    it('should return an Expense object', async () => {
      const fakeDbExpense: ExpensesDbRow = {
        id: 'expense-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Coffee',
        amount: 300,
        netAmount: 300,
        date: '2025-08-23',
        categoryId: 'category-1',
        subCategoryId: 'sub-category-1',
        paidBackAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const fakeExpenseSubCategory: ExpenseSubCategoryDbRow = {
        id: 'sub-category-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Coffee',
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

      returningMock.mockResolvedValueOnce([fakeDbExpense])
      mockDbQuery.expenseCategoriesTable.findFirst = jest
        .fn()
        .mockResolvedValue(fakeExpenseCategory)

      const result = await updateExpenseRepository(fakeInput)

      expect(result).toEqual({
        id: 'expense-1',
        userId: 'user-1',
        accountId: 'account-1',
        name: 'Coffee',
        amount: 300,
        netAmount: 300,
        date: '2025-08-23',
        paidBackAmount: 0,
        category: {
          ...fakeExpenseCategory,
          subCategories: [
            {
              ...fakeExpenseSubCategory,
              createdAt: fakeExpenseSubCategory.createdAt.toISOString(),
              updatedAt: fakeExpenseSubCategory.updatedAt.toISOString(),
            },
          ],
          createdAt: fakeExpenseCategory.createdAt.toISOString(),
          updatedAt: fakeExpenseCategory.updatedAt.toISOString(),
        },
        subCategory: {
          ...fakeExpenseSubCategory,
          createdAt: fakeExpenseSubCategory.createdAt.toISOString(),
          updatedAt: fakeExpenseSubCategory.updatedAt.toISOString(),
        },
        createdAt: fakeDbExpense.createdAt.toISOString(),
        updatedAt: fakeDbExpense.updatedAt.toISOString(),
      })
    })
  })

  describe('when the database returning returns an empty array', () => {
    it('should throw a repository error indicating no expense could be found', async () => {
      const fakeNoExpensesUpdated = [] as ExpensesDbRow[]
      returningMock.mockResolvedValueOnce(fakeNoExpensesUpdated)

      const promise = updateExpenseRepository(fakeInput)
      await expect(promise).rejects.toThrow(NOT_FOUND_ERROR)
      await expect(promise).rejects.toBeInstanceOf(RepositoryError)
    })
  })
})
