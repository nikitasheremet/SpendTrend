import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import type { Store } from '@/store/storeInterface'
import type { Expense, NewExpense } from '@/types/expenseData'
import AddExpenseTable from '../AddExpenseTable.vue'

// --- Store mock -----------------------------------------------------------

const clearNewExpensesMock = vi.fn()
const addExpensesMock = vi.fn()
const newExpensesRef = ref<NewExpense[]>([])

const mockStore = {
  categories: ref([]),
  newExpenses: newExpensesRef,
  newIncomes: ref([]),
  clearNewExpenses: clearNewExpensesMock,
  clearNewIncomes: vi.fn(),
  addExpenses: addExpensesMock,
  addNewExpense: vi.fn(),
  addNewIncome: vi.fn(),
  getAccountDetails: vi.fn(),
} as unknown as Store

vi.mock('@/store/store', () => ({
  getStore: () => mockStore,
}))

// --- Category helpers mock ------------------------------------------------

vi.mock('@/helpers/hooks/useGetCategories', () => ({
  useCategoriesInExpenseData: () => ({
    categories: ref([]),
    categoryNames: ref([]),
    getCategoryName: (id?: string) => id ?? '',
    getCategoryId: (name?: string) => name ?? '',
    getSubCategoryName: () => '',
    getSubCategoryId: () => '',
    getSubcategories: () => [],
    getCategory: () => undefined,
  }),
}))

// --- addNewExpense service mock -------------------------------------------

const addNewExpenseMock = vi.fn()
vi.mock('@/service/expenses/addNewExpense', () => ({
  addNewExpense: (...args: unknown[]) => addNewExpenseMock(...args),
}))

// --- Popover mock ----------------------------------------------------------

vi.mock('@/components/AddExpenseTable/hooks/RowDeletedPopover.vue', () => ({
  default: {},
}))

// --------------------------------------------------------------------------

const expense1: NewExpense = {
  date: '2026-01-01',
  name: 'Coffee',
  amount: 5,
  netAmount: 5,
  paidBackAmount: 0,
  category: '',
  subCategory: '',
}

const expense2: NewExpense = {
  date: '2026-01-02',
  name: 'Taxi',
  amount: 20,
  netAmount: 20,
  paidBackAmount: 0,
  category: '',
  subCategory: '',
}

const expense3: NewExpense = {
  date: '2026-01-03',
  name: 'Lunch',
  amount: 15,
  netAmount: 15,
  paidBackAmount: 0,
  category: '',
  subCategory: '',
}

const savedExpense: Expense = {
  id: 'saved-1',
  userId: 'u1',
  accountId: 'a1',
  date: '2026-01-01',
  name: 'Coffee',
  amount: 5,
  netAmount: 5,
  paidBackAmount: 0,
  category: undefined,
  subCategory: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function mountTable(modelValue: NewExpense[]) {
  return mount(AddExpenseTable, {
    props: { modelValue },
    global: {
      stubs: {
        // Stub the popover provider so inject() doesn't blow up
        RowDeletedPopover: true,
      },
    },
  })
}

describe('AddExpenseTable — SPE-108: deleted expense must not reappear after save', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    newExpensesRef.value = []
  })

  it('calls clearNewExpenses after a fully successful save', async () => {
    addNewExpenseMock.mockResolvedValue({
      createdExpenses: [savedExpense],
      failedExpenses: [],
    })

    const wrapper = mountTable([expense1])

    // Locate and click the "Save Expense" table action button
    const saveButton = wrapper.findAll('button').find((b) => b.text() === 'Save Expense')
    expect(saveButton, 'Save Expense button must exist').toBeTruthy()

    await saveButton!.trigger('click')
    await flushPromises()
    await nextTick()

    expect(clearNewExpensesMock).toHaveBeenCalledOnce()
  })

  it('does NOT call clearNewExpenses when some expenses fail to save', async () => {
    addNewExpenseMock.mockResolvedValue({
      createdExpenses: [],
      failedExpenses: [{ expenseInput: expense1, errorMessage: 'Server error' }],
    })

    const wrapper = mountTable([expense1])

    const saveButton = wrapper.findAll('button').find((b) => b.text() === 'Save Expense')
    await saveButton!.trigger('click')
    await flushPromises()
    await nextTick()

    expect(clearNewExpensesMock).not.toHaveBeenCalled()
  })

  it('clears the store after saving the remaining expenses when one was previously deleted', async () => {
    // The store starts with three expenses; the table is given all three.
    // The user deletes the second one (Taxi) from the table so only Coffee and
    // Lunch remain — Taxi must not be resurrected after save.
    addNewExpenseMock.mockResolvedValue({
      createdExpenses: [savedExpense],
      failedExpenses: [],
    })

    newExpensesRef.value = [expense1, expense2, expense3]
    const wrapper = mountTable([expense1, expense2, expense3])

    await nextTick()
    await nextTick()

    // Find the Delete button for the second row (Taxi, index 1)
    const deleteButtons = wrapper.findAll('button').filter((b) => b.text() === 'Delete')
    // Rows: expense1, expense2, expense3 — click the second Delete button
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2)
    await deleteButtons[1].trigger('click')
    await nextTick()

    // Save the remaining rows (expense1 and expense3, not expense2/Taxi)
    const saveButton = wrapper.findAll('button').find((b) => b.text() === 'Save Expense')
    await saveButton!.trigger('click')
    await flushPromises()
    await nextTick()

    // The store must have been explicitly cleared — deleted expense cannot reappear
    expect(clearNewExpensesMock).toHaveBeenCalledOnce()

    // Taxi (expense2) must NOT be among the expenses that were sent to the backend
    const calledWith: NewExpense[] = addNewExpenseMock.mock.calls[0][0]
    const submittedNames = calledWith.map((e: NewExpense) => e.name)
    expect(submittedNames).not.toContain('Taxi')
  })
})
