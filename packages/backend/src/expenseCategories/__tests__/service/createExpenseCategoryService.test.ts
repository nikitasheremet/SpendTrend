import { createExpenseCategoryService } from '../../service/createExpenseCategoryService'
import { createExpenseCategoryRepository } from '../../repository/createExpenseCategoryRepository'

jest.mock('../../repository/createExpenseCategoryRepository')

describe('createExpenseCategoryService', () => {
  const mockCreateExpenseCategoryRepository = createExpenseCategoryRepository as jest.Mock
  const fakeInput = {
    userId: 'user-123',
    accountId: 'acc-456',
    name: 'Groceries',
  }

  beforeEach(() => {
    mockCreateExpenseCategoryRepository.mockReset()
  })

  describe('when create call is successful', () => {
    it('should return the created expenseCategory', async () => {
      const fakeRepoRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Groceries',
        userId: 'user-123',
      }
      mockCreateExpenseCategoryRepository.mockResolvedValueOnce(fakeRepoRow)

      const result = await createExpenseCategoryService(fakeInput)

      expect(result).toBe(fakeRepoRow)
    })
  })
  describe('when call to repository function fails', () => {
    it('should throw the error', async () => {
      const mockError = new Error('Repository failure')
      mockCreateExpenseCategoryRepository.mockRejectedValueOnce(mockError)

      await expect(createExpenseCategoryService(fakeInput)).rejects.toThrow('Repository failure')
    })
  })
})
