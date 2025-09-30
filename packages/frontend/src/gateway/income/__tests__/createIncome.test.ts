import { createIncome, CreateIncomeRequest } from '@gateway/income/createIncome'
import { post } from '@gateway/post'

vi.mock('@gateway/post')

describe('createIncome', () => {
  const mockPost = vi.mocked(post)

  const fakeCreateIncomeRequest = {
    name: 'Test Income',
  } as CreateIncomeRequest

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when post succeeds', () => {
    it('should return the created income', async () => {
      const fakeResponse = {
        createdIncome: {
          id: 'income-123',
        },
      }
      mockPost.mockResolvedValue(fakeResponse)

      const result = await createIncome(fakeCreateIncomeRequest)

      expect(result).toEqual(
        expect.objectContaining({
          id: 'income-123',
        }),
      )
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
