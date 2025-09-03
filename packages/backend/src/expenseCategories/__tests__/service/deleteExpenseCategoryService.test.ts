import { deleteExpenseCategoryService } from '../../service/deleteExpenseCategoryService'
import * as repository from '../../repository/deleteExpenseCategoryRepository'

jest.mock('../../repository/deleteExpenseCategoryRepository')

describe('deleteExpenseCategoryService', () => {
  const mockRepository = repository.deleteExpenseCategoryRepository as jest.Mock

  beforeEach(() => {
    mockRepository.mockReset()
  })

  const fakeInput = {
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    id: '00000000-0000-4000-8000-000000000002',
  }

  const fakeResult = {
    id: '00000000-0000-4000-8000-000000000002',
    userId: '00000000-0000-4000-8000-000000000000',
    accountId: '00000000-0000-4000-8000-000000000001',
    name: 'Test Category',
    subcategories: ['sub1', 'sub2'],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  }

  describe('when deletion is successful', () => {
    it('should return the deleted expense category from repository', async () => {
      mockRepository.mockResolvedValueOnce(fakeResult)

      const result = await deleteExpenseCategoryService(fakeInput)

      expect(mockRepository).toHaveBeenCalledWith(fakeInput.id)
      expect(result).toEqual(fakeResult)
    })
  })

  describe('when repository throws an error', () => {
    it('should propagate the error', async () => {
      const fakeError = new Error('Repository error')
      mockRepository.mockRejectedValueOnce(fakeError)

      await expect(deleteExpenseCategoryService(fakeInput)).rejects.toThrow(fakeError)
    })
  })
})