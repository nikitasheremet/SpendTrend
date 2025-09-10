import { createExpenseSubcategoryService } from '../../service/createExpenseSubcategoryService'
import * as repository from '../../repository/createExpenseSubcategoryRepository'
import { CreateExpenseSubcategoryInput } from '../../validation/models'

jest.mock('../../repository/createExpenseSubcategoryRepository', () => ({
  createExpenseSubcategoryRepository: jest.fn(),
}))

const fakeInput = {} as CreateExpenseSubcategoryInput

describe('createExpenseSubcategoryService', () => {
  const mockedCreateExpenseSubcategoryRepository =
    repository.createExpenseSubcategoryRepository as jest.Mock

  beforeEach(() => {
    mockedCreateExpenseSubcategoryRepository.mockReset()
  })

  it('should throw an error if repository throws', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateExpenseSubcategoryRepository.mockRejectedValueOnce(error)

    // Act & Assert
    await expect(createExpenseSubcategoryService(fakeInput)).rejects.toThrow('Repository error')
  })

  it('should return the data returned from the repository and match type ExpenseSubCategory', async () => {
    // Arrange
    const expenseSubCategory = {
      id: '1',
      userId: '00000000-0000-4000-8000-000000000000',
      accountId: '00000000-0000-4000-8000-000000000001',
      categoryId: '00000000-0000-4000-8000-000000000002',
      name: 'Test Subcategory',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockedCreateExpenseSubcategoryRepository.mockResolvedValueOnce(expenseSubCategory)

    // Act
    const result = await createExpenseSubcategoryService(fakeInput)

    // Assert
    expect(result).toEqual(expenseSubCategory)
  })
})
