import { vi, describe, it, expect, beforeEach } from 'vitest'
import {
  updateExpenseSubCategory,
  UpdateExpenseSubCategoryRequest,
} from '@gateway/expenseSubCategory/updateExpenseSubCategory'
import { put } from '@gateway/put'
import { UpdateExpenseSubCategoryResponse } from '@contracts/expenseSubCategory/updateExpenseSubCategory'

vi.mock('@gateway/put')
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('updateExpenseSubCategory', () => {
  const mockPut = vi.mocked(put)

  const fakeUpdateExpenseSubCategoryRequest: UpdateExpenseSubCategoryRequest = {
    subCategoryId: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    accountId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Updated SubCategory Name',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when put succeeds', () => {
    it('should return the updated expense subcategory', async () => {
      const fakeResponse = {
        updatedExpenseSubCategory: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          accountId: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Updated SubCategory Name',
          categoryId: '123e4567-e89b-12d3-a456-426614174003',
          createdAt: new Date('2025-09-22T10:00:00Z'),
          updatedAt: new Date('2025-12-07T10:00:00Z'),
        },
      } as unknown as UpdateExpenseSubCategoryResponse
      mockPut.mockResolvedValue(fakeResponse)

      const result = await updateExpenseSubCategory(fakeUpdateExpenseSubCategoryRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Updated SubCategory Name',
        }),
      )
      expect(mockPut).toHaveBeenCalledWith(
        'updateexpensesubcategory',
        fakeUpdateExpenseSubCategoryRequest,
      )
    })
  })

  describe('when put fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockPut.mockRejectedValue(fakeError)

      await expect(updateExpenseSubCategory(fakeUpdateExpenseSubCategoryRequest)).rejects.toThrow(
        fakeError,
      )
      expect(console.error).toHaveBeenCalledWith('Error updating expense subcategory:', fakeError)
    })
  })
})
