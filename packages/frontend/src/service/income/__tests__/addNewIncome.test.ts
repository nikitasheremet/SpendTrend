import { addNewIncome } from '../addNewIncome'
import { createIncome } from '@/gateway/income/createIncome'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

vi.mock('@/gateway/income/createIncome')
vi.mock('@/store/store')

describe('addNewIncome', () => {
  const mockCreateIncome = vi.mocked(createIncome)
  const mockGetStore = vi.mocked(getStore)

  const fakeNewIncome = {
    name: 'Test Income',
    amount: 1000,
    date: '2023-01-01',
  }

  const fakeAccountDetails = {
    userId: 'user-123',
    accountId: 'account-123',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mockGetStore.mockReturnValue({
      getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
    } as any)
  })

  describe('when all required fields are provided', () => {
    it('should call createIncome with correct parameters and return result', async () => {
      const fakeIncome = {
        id: 'income-123',
      } as Income
      mockCreateIncome.mockResolvedValue(fakeIncome)

      const result = await addNewIncome(fakeNewIncome)

      expect(result).toEqual(fakeIncome)
    })
  })

  describe('when createIncome throws an error', () => {
    it('should propagate the error', async () => {
      const fakeError = new Error('Gateway error')
      mockCreateIncome.mockRejectedValue(fakeError)

      await expect(addNewIncome(fakeNewIncome)).rejects.toThrow(fakeError)
    })
  })

  describe('when getAccountDetails throws an error', () => {
    it('should propagate the error', async () => {
      const fakeError = new Error('Store error')
      const mockStore = {
        getAccountDetails: vi.fn().mockImplementation(() => {
          throw fakeError
        }),
      }
      mockGetStore.mockReturnValue(mockStore as any)

      await expect(addNewIncome(fakeNewIncome)).rejects.toThrow(fakeError)
    })
  })
})
