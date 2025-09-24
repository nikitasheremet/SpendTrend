import { describe, it, expect } from 'vitest'
import { createExpenseSubCategoryResponseToDomainExpenseSubCategory } from '../createExpenseSubCategoryResponseToDomainExpenseSubCategory'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'
import { ExpenseSubCategory } from '@/types/expenseData'

describe('createExpenseSubCategoryResponseToDomainExpenseSubCategory', () => {
  describe('when given a valid contract expense subcategory', () => {
    it('should map all fields correctly', () => {
      const fakeInput: ContractExpenseSubCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test SubCategory',
        categoryId: '123e4567-e89b-12d3-a456-426614174003',
        createdAt: new Date('2025-09-23T10:00:00Z'),
        updatedAt: new Date('2025-09-23T10:00:00Z'),
      }

      const expectedSubCategory: ExpenseSubCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test SubCategory',
        categoryId: '123e4567-e89b-12d3-a456-426614174003',
        createdAt: new Date('2025-09-23T10:00:00Z'),
        updatedAt: new Date('2025-09-23T10:00:00Z'),
      }

      const result = createExpenseSubCategoryResponseToDomainExpenseSubCategory(fakeInput)

      expect(result).toEqual(expectedSubCategory)
    })
  })

  describe('when given an invalid expense subcategory', () => {
    it('should throw an error', () => {
      const fakeInvalidInput = null as unknown as ContractExpenseSubCategory

      expect(() =>
        createExpenseSubCategoryResponseToDomainExpenseSubCategory(fakeInvalidInput),
      ).toThrow()
    })
  })
})
