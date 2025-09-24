import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getExpensesGateway, GetExpensesRequest } from '@gateway/expense/getExpenses'
import { get } from '@gateway/get'

vi.mock('@gateway/get')

describe('getExpensesGateway', () => {
  const mockGet = vi.mocked(get)

  const fakeRequest: GetExpensesRequest = {
    userId: 'user-123',
    accountId: 'account-456',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when get succeeds', () => {
    it('should return the mapped expenses', async () => {
      const fakeResponse = {
        expenses: [
          {
            id: 'expense-123',
            category: {
              id: 'category-123',
              subCategories: [],
            },
          },
        ],
      }
      mockGet.mockResolvedValue(fakeResponse)

      const result = await getExpensesGateway(fakeRequest)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'expense-123',
          category: expect.objectContaining({
            id: 'category-123',
            subCategories: [],
          }),
        }),
      )
    })
  })

  describe('when get fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Get failed')
      mockGet.mockRejectedValue(fakeError)

      await expect(getExpensesGateway(fakeRequest)).rejects.toThrow(fakeError)
    })
  })
})
