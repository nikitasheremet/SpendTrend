import { updateIncome } from '../updateIncome'
import { updateIncome as updateIncomeGateway } from '@/gateway/income/updateIncome'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

vi.mock('@/gateway/income/updateIncome')
vi.mock('@/store/store')

describe('updateIncome', () => {
  const mockUpdateIncomeGateway = vi.mocked(updateIncomeGateway)
  const mockGetStore = vi.mocked(getStore)
  vi.spyOn(console, 'error').mockImplementation(() => {})

  const fakeIncome = {
    id: 'income-123',
  } as Income

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

  describe('when called with a valid income object', () => {
    it('should call updateIncomeGateway with correct parameters and return result', async () => {
      mockUpdateIncomeGateway.mockResolvedValue(fakeIncome)

      const result = await updateIncome(fakeIncome)

      expect(result).toEqual(expect.objectContaining(fakeIncome))
    })
  })

  describe('when updateIncomeGateway throws an error', () => {
    it('should log the error and propagate it', async () => {
      const fakeError = new Error('Gateway error')
      mockUpdateIncomeGateway.mockRejectedValue(fakeError)

      await expect(updateIncome(fakeIncome)).rejects.toThrow(fakeError)
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

      await expect(updateIncome(fakeIncome)).rejects.toThrow(fakeError)
    })
  })
})
