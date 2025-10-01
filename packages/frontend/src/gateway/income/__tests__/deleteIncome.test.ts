import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteIncome } from '../deleteIncome'
import { post } from '@gateway/post'
import { Income } from '@/types/income/income'
import { DeleteIncomeResponse } from '@contracts/income/deleteIncome'

vi.mock('@gateway/post')

const mockPost = vi.mocked(post)

describe('when deleteIncome is called', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const fakeRequest = {
    userId: 'fake-user-id',
    accountId: 'fake-account-id',
    id: 'fake-income-id',
  }

  const fakeResponse: DeleteIncomeResponse = {
    deletedIncome: {
      id: 'fake-income-id',
      userId: 'fake-user-id',
      accountId: 'fake-account-id',
      name: 'Fake Income',
      amount: 1000,
      date: '2023-01-01',
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    },
  }

  const fakeDomainIncome = {
    id: 'fake-income-id',
  } as Income

  describe('when post request throws an error', () => {
    it('should throw an error', async () => {
      const fakeError = new Error('Network error')
      mockPost.mockRejectedValue(fakeError)

      await expect(deleteIncome(fakeRequest)).rejects.toThrow('Network error')
    })
  })

  describe('when request to delete is successful', () => {
    it('should return the mapped domain income', async () => {
      mockPost.mockResolvedValue(fakeResponse)

      const result = await deleteIncome(fakeRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'fake-income-id',
        }),
      )
    })
  })
})
