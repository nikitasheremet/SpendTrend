import { updateExpenseCategoryService } from '../../service/updateExpenseCategoryService'
import { updateExpenseCategoryRepository } from '../../repository/updateExpenseCategoryRepository'
import { UpdateExpenseCategoryInput } from '../../validation/models'

jest.mock('../../repository/updateExpenseCategoryRepository')

const mockUpdateExpenseCategoryRepository = updateExpenseCategoryRepository as jest.Mock

describe('updateExpenseCategoryService', () => {
  const fakeInput = {} as UpdateExpenseCategoryInput

  const fakeUpdatedExpenseCategory = {
    id: '00000000-0000-4000-8000-000000000002',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when repository throws an error', () => {
    it('should throw that error', async () => {
      const mockError = new Error('Repository error')
      mockUpdateExpenseCategoryRepository.mockRejectedValue(mockError)

      await expect(updateExpenseCategoryService(fakeInput)).rejects.toThrow(mockError)
    })
  })

  describe('when repository succeeds', () => {
    it('should return the updated expense category', async () => {
      mockUpdateExpenseCategoryRepository.mockResolvedValue(fakeUpdatedExpenseCategory)

      const result = await updateExpenseCategoryService(fakeInput)

      expect(result).toBe(fakeUpdatedExpenseCategory)
    })
  })
})
