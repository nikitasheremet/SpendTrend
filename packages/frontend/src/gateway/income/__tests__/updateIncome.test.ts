import { updateIncome } from '../updateIncome'
import { put } from '@gateway/put'

vi.mock('@gateway/put')

const mockPut = vi.mocked(put)

describe('when updateIncome is called', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const fakeRequest = {
    userId: 'fake-user-id',
    accountId: 'fake-account-id',
    id: 'fake-income-id',
    name: 'Updated Income',
    amount: 2000,
    date: '2023-02-01',
  }

  const fakeResponse = {
    updatedIncome: {
      id: 'fake-income-id',
    },
  }

  describe('when put request throws an error', () => {
    it('should throw an error', async () => {
      const fakeError = new Error('Network error')
      mockPut.mockRejectedValue(fakeError)

      await expect(updateIncome(fakeRequest)).rejects.toThrow('Network error')
    })
  })

  describe('when request to update is successful', () => {
    it('should return the mapped domain income', async () => {
      mockPut.mockResolvedValue(fakeResponse)

      const result = await updateIncome(fakeRequest)

      expect(result).toEqual(fakeResponse.updatedIncome)
    })
  })
})
