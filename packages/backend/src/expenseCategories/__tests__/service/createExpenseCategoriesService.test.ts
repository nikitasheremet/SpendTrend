import { createExpenseCategoriesService } from '../../service/createExpenseCategoriesService'
import { createExpenseCategoriesRepository } from '../../repository/createExpenseCategoriesRepository'

vi.mock('../../repository/createExpenseCategoriesRepository')

describe('when createExpenseCategoriesService is called', () => {
  const mockCreateExpenseCategoriesRepository = createExpenseCategoriesRepository as Mock
  const fakeInput = {
    userId: 'user-123',
    accountId: 'acc-456',
    name: ['Groceries', 'Transport'],
  }

  beforeEach(() => {
    mockCreateExpenseCategoriesRepository.mockReset()
  })

  describe('when create call is successful', () => {
    it('should return the created expenseCategories', async () => {
      const fakeRepoRows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174100',
          userId: 'user-123',
          accountId: 'acc-456',
          name: 'Groceries',
          subCategories: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174101',
          userId: 'user-123',
          accountId: 'acc-456',
          name: 'Transport',
          subCategories: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      mockCreateExpenseCategoriesRepository.mockResolvedValueOnce(fakeRepoRows)

      const result = await createExpenseCategoriesService(fakeInput)

      expect(result).toBe(fakeRepoRows)
      expect(mockCreateExpenseCategoriesRepository).toHaveBeenCalledWith(fakeInput)
    })
  })

  describe('when call to repository function fails', () => {
    it('should throw the error', async () => {
      const mockError = new Error('Repository failure')
      mockCreateExpenseCategoriesRepository.mockRejectedValueOnce(mockError)

      await expect(createExpenseCategoriesService(fakeInput)).rejects.toThrow('Repository failure')
    })
  })
})
