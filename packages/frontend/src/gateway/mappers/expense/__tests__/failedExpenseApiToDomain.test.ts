import { describe, it, expect } from 'vitest'
import { apiFailedExpenseToDomain, apiFailedExpensesToDomain } from '../failedExpenseApiToDomain'

describe('apiFailedExpenseToDomain', () => {
  it('should map a single failed expense from API to domain NewExpense', () => {
    const apiFailed = {
      expenseInput: {
        userId: 'user-1',
        accountId: 'acc-1',
        name: 'Fail Expense',
        amount: 50,
        netAmount: 45,
        date: '2026-01-02',
        categoryId: 'cat-1',
        paidBackAmount: 0,
      },
      errorMessage: 'Invalid category',
    }

    const result = apiFailedExpenseToDomain(apiFailed)

    expect(result).toEqual({
      expenseInput: {
        date: '2026-01-02',
        name: 'Fail Expense',
        netAmount: 45,
        amount: 50,
        paidBackAmount: 0,
        category: 'cat-1',
        subCategory: '',
      },
      errorMessage: 'Invalid category',
    })
  })

  it('should map an array of failed expenses', () => {
    const apiFailedArray = [
      {
        expenseInput: {
          userId: 'user-1',
          accountId: 'acc-1',
          name: 'Fail Expense',
          amount: 50,
          netAmount: 45,
          date: '2026-01-02',
          categoryId: 'cat-1',
          paidBackAmount: 0,
        },
        errorMessage: 'Invalid category',
      },
    ]

    const result = apiFailedExpensesToDomain(apiFailedArray)

    expect(result).toHaveLength(1)
    expect(result[0].expenseInput.category).toBe('cat-1')
  })
})
