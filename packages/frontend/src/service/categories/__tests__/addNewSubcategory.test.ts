import { addNewSubcategory } from '../addNewSubCategory'
import { createExpenseSubCategory } from '@/gateway/expenseSubCategory/createExpenseSubCategory'
import { getStore } from '@/store/store'
import { Store } from '@/store/storeInterface'
import type { ExpenseSubCategory } from '@/types/expenseData'

vi.mock('@/gateway/expenseSubCategory/createExpenseSubCategory')
const mockCreateExpenseSubCategory = vi.mocked(createExpenseSubCategory)

vi.mock('@/store/store')
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('when addNewSubcategory is called', () => {
  const fakeUserId = 'user-1'
  const fakeAccountId = 'account-1'
  const fakeCategoryId = 'category-1'
  const fakeSubCategoryName = 'Test SubCategory'
  const fakeExpenseSubCategory = {
    id: 'sub-1',
  } as ExpenseSubCategory

  beforeEach(() => {
    vi.mocked(getStore).mockReturnValue({
      getAccountDetails: () => Promise.resolve({ userId: fakeUserId, accountId: fakeAccountId }),
    } as unknown as Store)
    mockCreateExpenseSubCategory.mockResolvedValue(fakeExpenseSubCategory)
  })

  it('should call createExpenseSubCategory and return created subcategory', async () => {
    const result = await addNewSubcategory(fakeCategoryId, fakeSubCategoryName)

    expect(result).toEqual(fakeExpenseSubCategory)
  })

  it('should throw and log error if API call fails', async () => {
    const mockError = new Error('API failed')

    mockCreateExpenseSubCategory.mockRejectedValueOnce(mockError)

    await expect(addNewSubcategory(fakeCategoryId, fakeSubCategoryName)).rejects.toThrow(
      'API failed',
    )
  })
})
