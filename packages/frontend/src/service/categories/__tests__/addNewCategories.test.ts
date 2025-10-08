import { addNewCategory } from '../addNewCategories'
import { createExpenseCategory } from '@/gateway/expenseCategory/createExpenseCategory'
import { getStore } from '@/store/store'
import type { ExpenseCategory, NewExpenseCategory } from '@/types/expenseData'

vi.mock('@/gateway/expenseCategory/createExpenseCategory')
const mockCreateExpenseCategory = vi.mocked(createExpenseCategory)

vi.mock('@/store/store')
vi.spyOn(console, 'error').mockImplementation(() => {})

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
    vi.mocked(getStore).mockReturnValue({
      getAccountDetails: () => Promise.resolve({ userId: fakeUserId, accountId: fakeAccountId }),
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
