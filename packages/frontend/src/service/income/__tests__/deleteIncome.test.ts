import { deleteIncome } from '../deleteIncome'
import { deleteIncome as deleteIncomeGateway } from '@/gateway/income/deleteIncome'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

vi.mock('@/gateway/income/deleteIncome')
vi.mock('@/store/store')

describe('deleteIncome', () => {
  const mockDeleteIncomeGateway = vi.mocked(deleteIncomeGateway)
  const mockGetStore = vi.mocked(getStore)
  vi.spyOn(console, 'error').mockImplementation(() => {})

  const fakeIncomeId = 'income-123'
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

  describe('when called with a valid income ID', () => {
    it('should call deleteIncomeGateway with correct parameters and return result', async () => {
      const fakeIncome = {
        id: fakeIncomeId,
        userId: fakeAccountDetails.userId,
        accountId: fakeAccountDetails.accountId,
        name: 'Test Income',
        amount: 1000,
        date: '2023-01-01',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      } as Income
      mockDeleteIncomeGateway.mockResolvedValue(fakeIncome)

      const result = await deleteIncome(fakeIncomeId)

      expect(result).toEqual(fakeIncome)
    })
  })

  describe('when deleteIncomeGateway throws an error', () => {
    it('should log the error and propagate it', async () => {
      const fakeError = new Error('Gateway error')
      mockDeleteIncomeGateway.mockRejectedValue(fakeError)

      await expect(deleteIncome(fakeIncomeId)).rejects.toThrow(fakeError)
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

      await expect(deleteIncome(fakeIncomeId)).rejects.toThrow(fakeError)
    })
  })
})
