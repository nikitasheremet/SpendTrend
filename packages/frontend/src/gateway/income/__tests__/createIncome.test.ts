import { createIncome, CreateIncomeRequest } from '@gateway/income/createIncome'
import { post } from '@gateway/post'

vi.mock('@gateway/post')

describe('createIncome', () => {
  const mockPost = vi.mocked(post)

  const fakeCreateIncomeRequest = {
    userId: 'user-123',
    accountId: 'account-123',
    incomesToCreate: [
      {
        name: 'Test Income',
        amount: 123.45,
        date: '2024-01-01',
      },
    ],
  } as CreateIncomeRequest

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the created and failed incomes', async () => {
      const fakeResponse = {
        createdIncomes: [
          {
            id: 'income-123',
            userId: 'user-123',
            accountId: 'account-123',
            name: 'Test Income',
            amount: 123.45,
            date: '2024-01-01',
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
          },
        ],
        failedIncomes: [
          {
            incomeInput: {
              name: 'Test Income',
              amount: 123.45,
              date: '2024-01-01',
            },
            errorMessage: 'Validation failed',
          },
        ],
      }
      mockPost.mockResolvedValue(fakeResponse)

      const result = await createIncome(fakeCreateIncomeRequest)

      expect(mockPost).toHaveBeenCalledWith('createincome', fakeCreateIncomeRequest)
      expect(result).toEqual({
        createdIncomes: [expect.objectContaining({ id: 'income-123' })],
        failedIncomes: [
          {
            incomeInput: {
              name: 'Test Income',
              amount: 123.45,
              date: '2024-01-01',
            },
            errorMessage: 'Validation failed',
          },
        ],
      })
    })
  })

  describe('when post fails', () => {
    it('should throw the error', async () => {
      const fakeError = new Error('Post failed')
      mockPost.mockRejectedValue(fakeError)

      await expect(createIncome(fakeCreateIncomeRequest)).rejects.toThrow(fakeError)
    })
  })
})
