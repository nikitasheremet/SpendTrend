import { describe, it, expect } from 'vitest'
import { getIncomesResponseToDomain } from '../getIncomesResponseToDomain'
import { Income as ContractIncome } from '@contracts/income/models'
import { Income } from '@/types/income/income'

describe('getIncomesResponseToDomain', () => {
  describe('when given an empty array', () => {
    it('should return an empty array', () => {
      const fakeInput: ContractIncome[] = []

      const result = getIncomesResponseToDomain(fakeInput)

      expect(result).toEqual([])
    })
  })

  describe('when given an array with incomes', () => {
    it('should map each income to domain type', () => {
      const fakeInput: ContractIncome[] = [
        {
          id: 'income-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Income 1',
          amount: 1000,
          date: '2023-01-01',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        {
          id: 'income-456',
          userId: 'user-456',
          accountId: 'account-456',
          name: 'Test Income 2',
          amount: 2000,
          date: '2023-01-02',
          createdAt: new Date('2023-01-02T00:00:00Z'),
          updatedAt: new Date('2023-01-02T00:00:00Z'),
        },
      ]

      const expectedIncomes: Income[] = [
        {
          id: 'income-123',
          userId: 'user-123',
          accountId: 'account-123',
          name: 'Test Income 1',
          amount: 1000,
          date: '2023-01-01',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
        },
        {
          id: 'income-456',
          userId: 'user-456',
          accountId: 'account-456',
          name: 'Test Income 2',
          amount: 2000,
          date: '2023-01-02',
          createdAt: new Date('2023-01-02T00:00:00Z'),
          updatedAt: new Date('2023-01-02T00:00:00Z'),
        },
      ]

      const result = getIncomesResponseToDomain(fakeInput)

      expect(result).toEqual(expectedIncomes)
    })
  })
})
