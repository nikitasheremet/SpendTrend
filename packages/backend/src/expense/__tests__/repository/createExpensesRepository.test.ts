import { createExpenseRepository, CreateExpense } from '../../repository/createExpenseRepository'
import { db } from '../../../db'

jest.mock('../../../db')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('createExpenseRepository', () => {
  const mockDbInsert = db.insert as jest.Mock
  const fakeDbQuery = db.query

  const fakeCategoryId = 'category-1'
  const fakeSubCategoryId = 'sub-category-1'

  const fakeValidExpense: CreateExpense = {
    userId: 'user-1',
    accountId: 'account-1',
    name: 'Test Expense',
    amount: 100,
    netAmount: 90,
    date: '2025-08-04',
    categoryId: fakeCategoryId,
    subCategoryId: fakeSubCategoryId,
    paidBackAmount: 0,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when the database throws an error', () => {
    it('should throw an error', async () => {
      const errorMessage = 'DB error'
      mockDbInsert.mockImplementation(() => {
        throw new Error(errorMessage)
      })
      await expect(createExpenseRepository(fakeValidExpense)).rejects.toThrow(errorMessage)
    })
  })

  describe('when the database successfully inserts a new expense', () => {
    it('should return an object of type Expense', async () => {
      const fakeExpenseId = 'expense-1'

      const fakeDbExpense = {
        id: fakeExpenseId,
        ...fakeValidExpense,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockDbInsert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbExpense]),
        }),
      })
      const fakeExpenseSubCategory = {
        id: fakeSubCategoryId,
        userId: 'user-1',
        accountId: 'account-1',
        categoryId: fakeCategoryId,
        name: 'Groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const fakeExpenseCategoryQueryResponse = {
        id: fakeCategoryId,
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

      const result = await createExpenseRepository(fakeValidExpense)
      expect(result).toEqual({
        id: fakeExpenseId,
        userId: fakeValidExpense.userId,
        accountId: fakeValidExpense.accountId,
        name: fakeValidExpense.name,
        amount: fakeValidExpense.amount,
        netAmount: fakeValidExpense.netAmount,
        date: fakeValidExpense.date,
        category: {
          id: fakeCategoryId,
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
        paidBackAmount: fakeValidExpense.paidBackAmount,
        createdAt: fakeDbExpense.createdAt.toISOString(),
        updatedAt: fakeDbExpense.updatedAt.toISOString(),
      })
    })
  })
})
