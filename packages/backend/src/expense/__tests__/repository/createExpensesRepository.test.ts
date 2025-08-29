import { createExpenseRepository, CreateExpense } from '../../repository/createExpenseRepository'
import { db } from '../../../db'

jest.mock('../../../db')

describe('createExpenseRepository', () => {
  const mockDbInsert = db.insert as jest.Mock

  const fakeValidExpense: CreateExpense = {
    userId: 'user-1',
    accountId: 'account-1',
    name: 'Test Expense',
    amount: 100,
    netAmount: 90,
    date: '2025-08-04',
    category: 'Food',
    subCategory: 'Groceries',
    paidBackAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
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
      }
      mockDbInsert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([fakeDbExpense]),
        }),
      })

      const result = await createExpenseRepository(fakeValidExpense)
      expect(result).toEqual({
        id: fakeExpenseId,
        userId: fakeValidExpense.userId,
        accountId: fakeValidExpense.accountId,
        name: fakeValidExpense.name,
        amount: fakeValidExpense.amount,
        netAmount: fakeValidExpense.netAmount,
        date: fakeValidExpense.date,
        category: fakeValidExpense.category,
        subCategory: fakeValidExpense.subCategory,
        paidBackAmount: fakeValidExpense.paidBackAmount,
        createdAt: fakeValidExpense.createdAt.toISOString(),
        updatedAt: fakeValidExpense.updatedAt.toISOString(),
      })
    })
  })
})
