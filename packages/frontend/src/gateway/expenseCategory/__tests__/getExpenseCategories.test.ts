import { vi } from 'vitest'
import {
  getExpenseCategories,
  GetExpenseCategoriesRequest,
} from '@gateway/expenseCategory/getExpenseCategories'
import { get } from '@gateway/get'
import { GetExpenseCategoriesResponse } from '@contracts/expenseCategory/getExpenseCategories'

vi.mock('@gateway/get')

describe('getExpenseCategories', () => {
  const mockGet = vi.mocked(get)

  const fakeGetExpenseCategoriesRequest: GetExpenseCategoriesRequest = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when get succeeds', () => {
    it('should return the expense categories', async () => {
      const fakeResponse = {
        expenseCategories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            subCategories: [],
          },
        ],
      } as unknown as GetExpenseCategoriesResponse
      mockGet.mockResolvedValue(fakeResponse)

      const result = await getExpenseCategories(fakeGetExpenseCategoriesRequest)

      expect(result).toEqual([
        expect.objectContaining({
          id: '123e4567-e89b-12d3-a456-426614174002',
        }),
      ])
    })
  })

  describe('when get fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Network error')
      mockGet.mockRejectedValue(fakeError)

      await expect(getExpenseCategories(fakeGetExpenseCategoriesRequest)).rejects.toThrow(fakeError)
    })
  })
})
