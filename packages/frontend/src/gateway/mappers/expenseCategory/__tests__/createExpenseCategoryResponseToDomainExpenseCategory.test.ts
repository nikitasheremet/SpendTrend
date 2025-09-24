import { describe, it, expect } from 'vitest'
import { createExpenseCategoryResponseToDomainExpenseCategory } from '../createExpenseCategoryResponseToDomainExpenseCategory'
import { ExpenseCategory as ContractExpenseCategory } from '@contracts/expenseCategory/models'
import { ExpenseCategory } from '@/types/expenseData'

describe('createExpenseCategoryResponseToDomainExpenseCategory', () => {
  describe('when given a valid contract expense category', () => {
    it('should map all fields correctly', () => {
      const fakeInput: ContractExpenseCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test Category',
        subCategories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            accountId: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Test SubCategory',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date('2025-09-22T10:00:00Z'),
            updatedAt: new Date('2025-09-22T10:00:00Z'),
          },
        ],
        createdAt: new Date('2025-09-22T10:00:00Z'),
        updatedAt: new Date('2025-09-22T10:00:00Z'),
      }

      const expectedCategory: ExpenseCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test Category',
        subCategories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            accountId: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Test SubCategory',
            categoryId: '123e4567-e89b-12d3-a456-426614174000',
            createdAt: new Date('2025-09-22T10:00:00Z'),
            updatedAt: new Date('2025-09-22T10:00:00Z'),
          },
        ],
        createdAt: new Date('2025-09-22T10:00:00Z'),
        updatedAt: new Date('2025-09-22T10:00:00Z'),
      }

      const result = createExpenseCategoryResponseToDomainExpenseCategory(fakeInput)

      expect(result).toEqual(expectedCategory)
    })
  })

  describe('when given an invalid expense category', () => {
    it('should throw an error', () => {
      const fakeInvalidInput = null as unknown as ContractExpenseCategory

      expect(() => createExpenseCategoryResponseToDomainExpenseCategory(fakeInvalidInput)).toThrow()
    })
  })
})
