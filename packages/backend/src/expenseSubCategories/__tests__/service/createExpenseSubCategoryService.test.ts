import { createExpenseSubCategoryService } from '../../service/createExpenseSubCategoryService'
import { createExpenseSubCategoryRepository } from '../../repository/createExpenseSubCategoryRepository'
import { CreateExpenseSubCategoryInput } from '../../validation/models'

jest.mock('../../repository/createExpenseSubCategoryRepository')

const fakeInput = {} as CreateExpenseSubCategoryInput

describe('createExpenseSubcategoryService', () => {
  const mockedCreateExpenseSubCategoryRepository = createExpenseSubCategoryRepository as jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if repository throws', async () => {
    // Arrange
    const error = new Error('Repository error')
    mockedCreateExpenseSubCategoryRepository.mockRejectedValueOnce(error)

    // Act & Assert
    await expect(createExpenseSubCategoryService(fakeInput)).rejects.toThrow('Repository error')
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
    mockedCreateExpenseSubCategoryRepository.mockResolvedValueOnce(expenseSubCategory)

    // Act
    const result = await createExpenseSubCategoryService(fakeInput)

    // Assert
    expect(result).toEqual(expenseSubCategory)
  })
})
