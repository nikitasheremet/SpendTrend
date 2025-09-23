import { addNewCategory } from '../addNewCategories'
import { createExpenseCategory } from '@/gateway/expenseCategory/createExpenseCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory, NewExpenseCategory } from '@/types/expenseData'

jest.mock('@/gateway/expenseCategory/createExpenseCategory')
const mockCreateExpenseCategory = createExpenseCategory as jest.Mock

jest.mock('@/store/store')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('when addNewCategory is called', () => {
  const fakeUserId = 'user-1'
  const fakeAccountId = 'account-1'
  const fakeCategory: NewExpenseCategory = { name: 'Test' }
  const fakeExpenseCategory: ExpenseCategory = {
    id: 'cat-1',
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Test',
    subCategories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    ;(getStore as jest.Mock).mockReturnValue({
      getAccountDetails: () => ({ userId: fakeUserId, accountId: fakeAccountId }),
    })
    mockCreateExpenseCategory.mockResolvedValue(fakeExpenseCategory)
  })

  it('should call createExpenseCategory and return created category', async () => {
    const result = await addNewCategory(fakeCategory)

    expect(result).toEqual(fakeExpenseCategory)
  })

  it('should throw and log error if API call fails', async () => {
    const mockError = new Error('API failed')

    mockCreateExpenseCategory.mockRejectedValueOnce(mockError)

    await expect(addNewCategory(fakeCategory)).rejects.toThrow('API failed')
  })
})
