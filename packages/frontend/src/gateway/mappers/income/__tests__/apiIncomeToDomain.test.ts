import { describe, it, expect } from 'vitest'
import { apiIncomeToDomain } from '../apiIncomeToDomain'
import { Income as ContractIncome } from '@contracts/income/models'
import { Income } from '@/types/income/income'

describe('apiIncomeToDomain', () => {
  describe('when given a valid contract income', () => {
    it('should map all fields correctly', () => {
      const fakeInput: ContractIncome = {
        id: 'income-123',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Test Income',
        amount: 1000,
        date: '2023-01-01',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const expectedIncome: Income = {
        id: 'income-123',
        userId: 'user-123',
        accountId: 'account-123',
        name: 'Test Income',
        amount: 1000,
        date: '2023-01-01',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      }

      const result = apiIncomeToDomain(fakeInput)

      expect(result).toEqual(expectedIncome)
    })
  })
})
