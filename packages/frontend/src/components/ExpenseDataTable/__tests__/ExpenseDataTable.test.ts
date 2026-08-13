import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { Store } from '@/store/storeInterface'
import type { Expense, ExpenseCategory, ExpenseSubCategory } from '@/types/expenseData'
import type { ColumnConfig } from '../../DesignSystem/Table'
import { GenericTable } from '../../DesignSystem/Table'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import ExpenseDataTable from '../ExpenseDataTable.vue'

// --- Store mock -------------------------------------------------------------

const addCategoryMock = vi.fn()
const addSubCategoryMock = vi.fn()
const expensesRef = ref<Expense[]>([])

const mockStore = {
  expenses: expensesRef,
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
  addCategory: addCategoryMock,
  addSubCategory: addSubCategoryMock,
  getAccountDetails: vi.fn(),
} as unknown as Store

vi.mock('@/store/store', () => ({
  getStore: () => mockStore,
}))

// --- Category helpers mock ---------------------------------------------------

const foodCategory: ExpenseCategory = {
  id: 'cat-food',
  userId: 'u1',
  accountId: 'a1',
  name: 'Food',
  subCategories: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

const getCategoryMock = vi.fn((name: string) => (name === 'Food' ? foodCategory : undefined))

vi.mock('@/helpers/hooks/useGetCategories', () => ({
  useCategoriesInExpenseData: () => ({
    categories: ref([]),
    categoryNames: ref(['Food']),
    getCategoryName: () => '',
    getCategoryId: () => '',
    getSubCategoryName: () => '',
    getSubCategoryId: () => '',
    getSubcategories: () => [],
    getCategory: getCategoryMock,
  }),
}))

// --- Category creation service mocks -----------------------------------------

const addNewCategoryMock = vi.fn()
vi.mock('@/service/categories/addNewCategories', () => ({
  addNewCategory: (...args: unknown[]) => addNewCategoryMock(...args),
}))

const addNewSubcategoryMock = vi.fn()
vi.mock('@/service/categories/addNewSubCategory', () => ({
  addNewSubcategory: (...args: unknown[]) => addNewSubcategoryMock(...args),
}))

// -----------------------------------------------------------------------------

type DisplayExpense = Omit<Expense, 'category' | 'subCategory'> & {
  category: string
  subCategory: string
}

function mountTable() {
  return mount(ExpenseDataTable, {
    global: {
      provide: {
        [POPOVER_SYMBOL as unknown as string]: ref({ showPopover: vi.fn() }),
      },
      stubs: {
        RowNotificationPopover: true,
      },
    },
  })
}

function getColumn(wrapper: ReturnType<typeof mountTable>, key: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genericTable = wrapper.findComponent(GenericTable as any)
  const columns = genericTable.props('columns') as ColumnConfig<DisplayExpense>[]
  const column = columns.find((c) => c.key === key)
  if (!column) {
    throw new Error(`Column "${key}" not found`)
  }
  return column
}

describe('ExpenseDataTable — create category/subcategory from dropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    expensesRef.value = []
  })

  describe('category column', () => {
    it('is searchable and provides onCreateOption', () => {
      const wrapper = mountTable()
      const column = getColumn(wrapper, 'category')

      expect(column.dropdownSearchable).toBe(true)
      expect(column.onCreateOption).toBeDefined()
    })

    it('creates a new category and returns its name to select', async () => {
      const newCategory: ExpenseCategory = {
        id: 'cat-new',
        userId: 'u1',
        accountId: 'a1',
        name: 'Groceries',
        subCategories: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addNewCategoryMock.mockResolvedValue(newCategory)

      const wrapper = mountTable()
      const column = getColumn(wrapper, 'category')

      const result = await column.onCreateOption!('Groceries', { category: '' } as DisplayExpense)

      expect(addNewCategoryMock).toHaveBeenCalledWith({ name: 'Groceries' })
      expect(addCategoryMock).toHaveBeenCalledWith(newCategory)
      expect(result).toBe('Groceries')
    })
  })

  describe('subCategory column', () => {
    it('is searchable and provides onCreateOption', () => {
      const wrapper = mountTable()
      const column = getColumn(wrapper, 'subCategory')

      expect(column.dropdownSearchable).toBe(true)
      expect(column.onCreateOption).toBeDefined()
    })

    it('creates a new subcategory scoped to the row current category', async () => {
      const newSubCategory: ExpenseSubCategory = {
        id: 'sub-new',
        userId: 'u1',
        accountId: 'a1',
        name: 'Snacks',
        categoryId: foodCategory.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addNewSubcategoryMock.mockResolvedValue(newSubCategory)

      const wrapper = mountTable()
      const column = getColumn(wrapper, 'subCategory')

      const result = await column.onCreateOption!('Snacks', {
        category: 'Food',
      } as DisplayExpense)

      expect(addNewSubcategoryMock).toHaveBeenCalledWith(foodCategory.id, 'Snacks')
      expect(addSubCategoryMock).toHaveBeenCalledWith(foodCategory.id, newSubCategory)
      expect(result).toBe('Snacks')
    })

    it('throws when the row has no category selected yet', async () => {
      const wrapper = mountTable()
      const column = getColumn(wrapper, 'subCategory')

      await expect(
        column.onCreateOption!('Snacks', { category: '' } as DisplayExpense),
      ).rejects.toThrow()
      expect(addNewSubcategoryMock).not.toHaveBeenCalled()
    })
  })
})
