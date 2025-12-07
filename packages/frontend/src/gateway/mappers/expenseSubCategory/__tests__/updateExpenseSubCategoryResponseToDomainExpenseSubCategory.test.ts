import { describe, it, expect } from 'vitest'
import { updateExpenseSubCategoryResponseToDomainExpenseSubCategory } from '../updateExpenseSubCategoryResponseToDomainExpenseSubCategory'
import { ExpenseSubCategory as ContractExpenseSubCategory } from '@contracts/expenseSubCategory/models'
import { ExpenseSubCategory } from '@/types/expenseData'

describe('updateExpenseSubCategoryResponseToDomainExpenseSubCategory', () => {
  describe('when given a valid contract expense subcategory', () => {
    it('should map all fields correctly', () => {
      const fakeInput: ContractExpenseSubCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Updated SubCategory Name',
        categoryId: '123e4567-e89b-12d3-a456-426614174003',
        createdAt: new Date('2025-09-22T10:00:00Z'),
        updatedAt: new Date('2025-12-07T10:00:00Z'),
      }

      const expectedSubCategory: ExpenseSubCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        accountId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Updated SubCategory Name',
        categoryId: '123e4567-e89b-12d3-a456-426614174003',
        createdAt: new Date('2025-09-22T10:00:00Z'),
        updatedAt: new Date('2025-12-07T10:00:00Z'),
      }

      const result = updateExpenseSubCategoryResponseToDomainExpenseSubCategory(fakeInput)

      expect(result).toEqual(expectedSubCategory)
    })
  })

  describe('when given an invalid expense subcategory', () => {
    it('should throw an error', () => {
      const fakeInvalidInput = null as unknown as ContractExpenseSubCategory

      expect(() =>
        updateExpenseSubCategoryResponseToDomainExpenseSubCategory(fakeInvalidInput),
      ).toThrow()
    })
  })
})
