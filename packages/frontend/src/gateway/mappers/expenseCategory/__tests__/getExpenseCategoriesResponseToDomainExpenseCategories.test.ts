import { describe, it, expect } from 'vitest'
import { getExpenseCategoriesResponseToDomainExpenseCategories } from '../getExpenseCategoriesResponseToDomainExpenseCategories'
import { GetExpenseCategoriesResponse } from '@contracts/expenseCategory/getExpenseCategories'
import { ExpenseCategory } from '@/types/expenseData'

describe('getExpenseCategoriesResponseToDomainExpenseCategories', () => {
  describe('when given a valid response with expense categories', () => {
    it('should map all fields correctly for each category', () => {
      const fakeInput: GetExpenseCategoriesResponse = {
        expenseCategories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            accountId: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Test Category 1',
            subCategories: [
              {
                id: '123e4567-e89b-12d3-a456-426614174003',
                userId: '123e4567-e89b-12d3-a456-426614174001',
                accountId: '123e4567-e89b-12d3-a456-426614174002',
                name: 'Test SubCategory 1',
                categoryId: '123e4567-e89b-12d3-a456-426614174000',
                createdAt: new Date('2025-09-22T10:00:00Z'),
                updatedAt: new Date('2025-09-22T10:00:00Z'),
              },
            ],
            createdAt: new Date('2025-09-22T10:00:00Z'),
            updatedAt: new Date('2025-09-22T10:00:00Z'),
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174004',
            userId: '123e4567-e89b-12d3-a456-426614174001',
            accountId: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Test Category 2',
            subCategories: [],
            createdAt: new Date('2025-09-22T11:00:00Z'),
            updatedAt: new Date('2025-09-22T11:00:00Z'),
          },
        ],
      }

      const expectedCategories: ExpenseCategory[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          accountId: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Test Category 1',
          subCategories: [
            {
              id: '123e4567-e89b-12d3-a456-426614174003',
              userId: '123e4567-e89b-12d3-a456-426614174001',
              accountId: '123e4567-e89b-12d3-a456-426614174002',
              name: 'Test SubCategory 1',
              categoryId: '123e4567-e89b-12d3-a456-426614174000',
              createdAt: new Date('2025-09-22T10:00:00Z'),
              updatedAt: new Date('2025-09-22T10:00:00Z'),
            },
          ],
          createdAt: new Date('2025-09-22T10:00:00Z'),
          updatedAt: new Date('2025-09-22T10:00:00Z'),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174004',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          accountId: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Test Category 2',
          subCategories: [],
          createdAt: new Date('2025-09-22T11:00:00Z'),
          updatedAt: new Date('2025-09-22T11:00:00Z'),
        },
      ]

      const result = getExpenseCategoriesResponseToDomainExpenseCategories(fakeInput)

      expect(result).toEqual(expectedCategories)
    })
  })

  describe('when given a response with empty expense categories', () => {
    it('should return an empty array', () => {
      const fakeInput: GetExpenseCategoriesResponse = {
        expenseCategories: [],
      }

      const result = getExpenseCategoriesResponseToDomainExpenseCategories(fakeInput)

      expect(result).toEqual([])
    })
  })
})
