import { getAllIncomes } from '../getAllIncomes'
import { getIncomes } from '@/gateway/income/getIncomes'
import { getStore } from '@/store/store'
import { Income } from '@/types/income/income'

vi.mock('@/gateway/income/getIncomes')
vi.mock('@/store/store')

describe('getAllIncomes', () => {
  const mockGetIncomes = vi.mocked(getIncomes)
  const mockGetStore = vi.mocked(getStore)

  const fakeAccountDetails = {
    userId: 'user-123',
    accountId: 'account-123',
  }

  const fakeIncomes = [
    {
      id: 'income-1',
      name: 'Salary',
      amount: 5000,
      date: '2023-01-01',
    },
    {
      id: 'income-2',
      name: 'Bonus',
      amount: 1000,
      date: '2023-01-15',
    },
  ] as Income[]

  beforeEach(() => {
    vi.resetAllMocks()
    mockGetStore.mockReturnValue({
      getAccountDetails: vi.fn().mockReturnValue(fakeAccountDetails),
    } as any)
  })

  describe('when account details are available', () => {
    it('should call getIncomes with correct parameters and return result', async () => {
      mockGetIncomes.mockResolvedValue(fakeIncomes)

      const result = await getAllIncomes()

      expect(result).toEqual(fakeIncomes)
    })
  })

  describe('when getIncomes throws an error', () => {
    it('should propagate the error', async () => {
      const fakeError = new Error('Gateway error')
      mockGetIncomes.mockRejectedValue(fakeError)

      await expect(getAllIncomes()).rejects.toThrow(fakeError)
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

      await expect(getAllIncomes()).rejects.toThrow(fakeError)
    })
  })
})
