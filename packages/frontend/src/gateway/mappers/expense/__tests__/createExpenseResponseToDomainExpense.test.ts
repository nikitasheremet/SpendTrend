import { describe, it, expect } from 'vitest'
import { createExpenseResponseToDomainExpense } from '../createExpenseResponseToDomainExpense'
import { CreateExpenseResponse } from '@contracts/expense/createExpense'
import { Expense } from '@/types/expenseData'

describe('createExpenseResponseToDomainExpense', () => {
  describe('when given a valid response', () => {
    it('should map all fields correctly', () => {
      const fakeInput = {
        id: 'expense-123',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Test Expense',
        amount: 100,
        netAmount: 90,
        date: '2023-01-01',
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [
            {
              id: 'subcategory-123',
              userId: 'user-123',
              accountId: 'account-123',
              name: 'Test SubCategory',
              categoryId: 'category-123',
              createdAt: new Date('2023-01-01T00:00:00Z'),
              updatedAt: new Date('2023-01-01T00:00:00Z'),
            },
          ],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        subCategory: {
          id: 'subcategory-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test SubCategory',
          categoryId: 'category-123',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        paidBackAmount: 10,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const expectedExpense: Expense = {
        id: 'expense-123',
        userId: 'user-123',
        accountId: 'account-123',
        date: '2023-01-01',
        name: 'Test Expense',
        netAmount: 90,
        amount: 100,
        paidBackAmount: 10,
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [
            {
              id: 'subcategory-123',
              userId: 'user-123',
              accountId: 'account-123',
              name: 'Test SubCategory',
              categoryId: 'category-123',
              createdAt: new Date('2023-01-01T00:00:00Z'),
              updatedAt: new Date('2023-01-01T00:00:00Z'),
            },
          ],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        subCategory: {
          id: 'subcategory-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test SubCategory',
          categoryId: 'category-123',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const result = createExpenseResponseToDomainExpense(fakeInput)

      expect(result).toEqual(expectedExpense)
    })
  })
})
