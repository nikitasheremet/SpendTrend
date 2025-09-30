import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getIncomes, GetIncomesRequest } from '../getIncomes'
import { get } from '@gateway/get'

vi.mock('@gateway/get')

describe('getIncomes', () => {
  const mockGet = vi.mocked(get)

  const fakeRequest: GetIncomesRequest = {
    userId: 'user-123',
    accountId: 'account-456',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when get succeeds', () => {
    it('should return the mapped incomes', async () => {
      const fakeResponse = {
        incomes: [
          {
            id: 'income-123',
          },
          {
            id: 'income-456',
          },
        ],
      }
      mockGet.mockResolvedValue(fakeResponse)

      const result = await getIncomes(fakeRequest)

      expect(mockGet).toHaveBeenCalledWith('incomes', {
        userId: 'user-123',
        accountId: 'account-456',
      })
      expect(result).toEqual([
        expect.objectContaining({ id: 'income-123' }),
        expect.objectContaining({ id: 'income-456' }),
      ])
    })
  })

  describe('when get fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Get failed')
      mockGet.mockRejectedValue(fakeError)

      await expect(getIncomes(fakeRequest)).rejects.toThrow(fakeError)
    })
  })
})
