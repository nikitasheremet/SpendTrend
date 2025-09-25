import { vi, describe, it, expect, beforeEach } from 'vitest'
import { updateExpense, UpdateExpenseRequest } from '@gateway/expense/updateExpense'
import { put } from '@gateway/put'

vi.mock('@gateway/put')

describe('updateExpense', () => {
  const mockPut = vi.mocked(put)

  const fakeUpdateRequest: UpdateExpenseRequest = {
    id: 'expense-123',
    userId: 'user-123',
    accountId: 'account-123',
    name: 'Updated Expense Name',
    amount: 150,
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when put succeeds', () => {
    it('should return the updated expense', async () => {
      const fakeResponse = {
        updatedExpense: {
          id: 'expense-123',
          category: {
            id: 'category-123',
            subCategories: [],
          },
        },
      }
      mockPut.mockResolvedValue(fakeResponse)

      const result = await updateExpense(fakeUpdateRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'expense-123',
        }),
      )
    })
  })

  describe('when put fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Put failed')
      mockPut.mockRejectedValue(fakeError)

      await expect(updateExpense(fakeUpdateRequest)).rejects.toThrow(fakeError)
    })
  })
})
