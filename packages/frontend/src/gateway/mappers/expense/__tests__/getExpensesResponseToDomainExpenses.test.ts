import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getExpensesResponseToDomainExpenses } from '../getExpensesResponseToDomainExpenses'
import { Expense } from '@/types/expenseData'

describe('getExpensesResponseToDomainExpenses', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when given a response with multiple expenses', () => {
    it('should map each expense using apiExpenseToDomain', () => {
      const fakeContractExpense1 = {
        id: 'expense-1',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Expense 1',
        amount: 100,
        netAmount: 90,
        date: '2023-01-01',
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        paidBackAmount: 10,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const fakeContractExpense2 = {
        id: 'expense-2',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Expense 2',
        amount: 200,
        netAmount: 180,
        date: '2023-01-02',
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        paidBackAmount: 20,
        createdAt: new Date('2023-01-02T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
      }

      const fakeDomainExpense1: Expense = {
        id: 'expense-1',
        userId: 'user-123',
        accountId: 'account-123',
        date: '2023-01-01',
        name: 'Expense 1',
        netAmount: 90,
        amount: 100,
        paidBackAmount: 10,
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const fakeDomainExpense2: Expense = {
        id: 'expense-2',
        userId: 'user-123',
        accountId: 'account-123',
        date: '2023-01-02',
        name: 'Expense 2',
        netAmount: 180,
        amount: 200,
        paidBackAmount: 20,
        category: {
          id: 'category-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Category',
          subCategories: [],
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        createdAt: new Date('2023-01-02T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
      }

      const result = getExpensesResponseToDomainExpenses([
        fakeContractExpense1,
        fakeContractExpense2,
      ])

      expect(result).toEqual([fakeDomainExpense1, fakeDomainExpense2])
    })
  })

  describe('when given a response with empty expenses array', () => {
    it('should return an empty array', () => {
      const result = getExpensesResponseToDomainExpenses([])

      expect(result).toEqual([])
    })
  })
})
