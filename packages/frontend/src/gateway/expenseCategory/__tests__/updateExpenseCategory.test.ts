import { vi, describe, it, expect, beforeEach } from 'vitest'
import {
  updateExpenseCategory,
  UpdateExpenseCategoryRequest,
} from '@gateway/expenseCategory/updateExpenseCategory'
import { put } from '@gateway/put'
import { UpdateExpenseCategoryResponse } from '@contracts/expenseCategory/updateExpenseCategory'

vi.mock('@gateway/put')
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('updateExpenseCategory', () => {
  const mockPut = vi.mocked(put)

  const fakeUpdateExpenseCategoryRequest: UpdateExpenseCategoryRequest = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated Category Name',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when put succeeds', () => {
    it('should return the updated expense category', async () => {
      const fakeResponse = {
        expenseCategory: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          accountId: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Updated Category Name',
          subCategories: [],
          createdAt: new Date('2025-09-22T10:00:00Z'),
          updatedAt: new Date('2025-12-07T10:00:00Z'),
        },
      } as unknown as UpdateExpenseCategoryResponse
      mockPut.mockResolvedValue(fakeResponse)

      const result = await updateExpenseCategory(fakeUpdateExpenseCategoryRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Updated Category Name',
        }),
      )
      expect(mockPut).toHaveBeenCalledWith(
        'updateexpensecategory',
        fakeUpdateExpenseCategoryRequest,
      )
    })
  })

  describe('when put fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPut.mockRejectedValue(fakeError)

      await expect(updateExpenseCategory(fakeUpdateExpenseCategoryRequest)).rejects.toThrow(
        fakeError,
      )
      expect(console.error).toHaveBeenCalledWith('Error updating expense category:', fakeError)
    })
  })
})
