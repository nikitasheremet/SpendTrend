import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref, type Ref } from 'vue'
import type { Store } from '@/store/storeInterface'
import type { NewExpense } from '@/types/expenseData'
import type { NewIncome } from '@/types/income/income'
import {
  DUPLICATE_ENTRY_TYPE_EXPENSE,
  DUPLICATE_ENTRY_TYPE_INCOME,
  DUPLICATE_SOURCE_EXISTING,
  DUPLICATE_SOURCE_NEW,
  type ExpenseDuplicateEntry,
  type IncomeDuplicateEntry,
} from '@/store/storeDuplicateTypes'
import AddDataView from '../AddDataView.vue'

interface MockStoreContext {
  store: Store
  newExpensesRef: Ref<NewExpense[]>
  newIncomesRef: Ref<NewIncome[]>
  expenseDuplicatesRef: Ref<ExpenseDuplicateEntry[]>
  incomeDuplicatesRef: Ref<IncomeDuplicateEntry[]>
  isExpenseDuplicatesPresentRef: Ref<boolean>
  isIncomeDuplicatesPresentRef: Ref<boolean>
}

function createMockStoreContext(): MockStoreContext {
  const newExpensesRef = ref<NewExpense[]>([])
  const newIncomesRef = ref<NewIncome[]>([])
  const expenseDuplicatesRef = ref<ExpenseDuplicateEntry[]>([])
  const incomeDuplicatesRef = ref<IncomeDuplicateEntry[]>([])
  const isExpenseDuplicatesPresentRef = ref(false)
  const isIncomeDuplicatesPresentRef = ref(false)

  const store = {
    getAccountDetails: vi.fn(),
    categories: ref([]),
    deleteCategory: vi.fn(),
    addCategory: vi.fn(),
    updateCategory: vi.fn(),
    addSubCategory: vi.fn(),
    updateSubCategory: vi.fn(),
    expenses: ref([]),
    setExpenses: vi.fn(),
    addExpenses: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
    incomes: ref([]),
    setIncomes: vi.fn(),
    addIncomes: vi.fn(),
    updateIncome: vi.fn(),
    deleteIncome: vi.fn(),
    newExpenses: newExpensesRef,
    newIncomes: newIncomesRef,
    addNewExpense: vi.fn((expense: NewExpense) => {
      newExpensesRef.value.push(expense)
    }),
    addNewIncome: vi.fn((income: NewIncome) => {
      newIncomesRef.value.push(income)
    }),
    clearNewExpenses: vi.fn(() => {
      newExpensesRef.value = []
    }),
    clearNewIncomes: vi.fn(() => {
      newIncomesRef.value = []
    }),
    expenseDuplicates: expenseDuplicatesRef,
    incomeDuplicates: incomeDuplicatesRef,
    isExpenseDuplicatesPresent: isExpenseDuplicatesPresentRef,
    isIncomeDuplicatesPresent: isIncomeDuplicatesPresentRef,
    selectedMonth: ref(1),
    selectedYear: ref(2026),
    markSummaryPeriodAsManuallySelected: vi.fn(),
    applyLatestExpenseSummaryPeriodDefault: vi.fn(),
  } as unknown as Store

  return {
    store,
    newExpensesRef,
    newIncomesRef,
    expenseDuplicatesRef,
    incomeDuplicatesRef,
    isExpenseDuplicatesPresentRef,
    isIncomeDuplicatesPresentRef,
  }
}

const mockStoreContext = createMockStoreContext()

vi.mock('@/store/store', () => ({
  getStore: () => mockStoreContext.store,
}))

vi.mock('@/helpers/bankInfoFormatting/formatPastedBankData', () => ({
  formatPastedBankData: vi.fn(() => []),
}))

vi.mock('@/components/AddExpenseTable/AddExpenseTable.vue', async () => {
  return {
    default: {
      name: 'MockAddExpenseTable',
      props: {
        modelValue: {
          type: Array,
          default: () => [],
        },
        beforeSaveExpense: {
          type: Function,
          default: undefined,
        },
      },
      emits: ['update:modelValue', 'move-to-income'],
      setup(props: { beforeSaveExpense?: () => Promise<boolean> }) {
        const saveContinuationsCount = ref(0)

        async function triggerSaveAttempt() {
          const shouldContinueSaving = (await props.beforeSaveExpense?.()) ?? true
          if (!shouldContinueSaving) {
            return
          }

          saveContinuationsCount.value += 1
        }

        return {
          saveContinuationsCount,
          triggerSaveAttempt,
        }
      },
      template:
        '<div data-testid="mock-add-expense-table"><button @click="triggerSaveAttempt">Save Expense Attempt</button><span data-testid="mock-expense-save-continuations">{{ saveContinuationsCount }}</span></div>',
    },
  }
})

vi.mock('@/components/AddIncomeTable/AddIncomeTable.vue', async () => {
  return {
    default: {
      name: 'MockAddIncomeTable',
      props: {
        modelValue: {
          type: Array,
          default: () => [],
        },
        beforeSaveIncome: {
          type: Function,
          default: undefined,
        },
      },
      emits: ['update:modelValue', 'move-to-expense'],
      setup(props: { beforeSaveIncome?: () => Promise<boolean> }) {
        const saveContinuationsCount = ref(0)

        async function triggerSaveAttempt() {
          const shouldContinueSaving = (await props.beforeSaveIncome?.()) ?? true
          if (!shouldContinueSaving) {
            return
          }

          saveContinuationsCount.value += 1
        }

        return {
          saveContinuationsCount,
          triggerSaveAttempt,
        }
      },
      template:
        '<div data-testid="mock-add-income-table"><button @click="triggerSaveAttempt">Save Income Attempt</button><span data-testid="mock-income-save-continuations">{{ saveContinuationsCount }}</span></div>',
    },
  }
})

const fakeBaseExpense: NewExpense = {
  date: '2026-03-20',
  name: 'Coffee',
  amount: 10,
  netAmount: 10,
  paidBackAmount: 0,
  category: 'Food',
  subCategory: 'Cafe',
}

const fakeBaseIncome: NewIncome = {
  date: '2026-03-20',
  name: 'Salary',
  amount: 1000,
}

function createExpenseDuplicate(draftIndex: number): ExpenseDuplicateEntry {
  return {
    type: DUPLICATE_ENTRY_TYPE_EXPENSE,
    duplicateKey: `expense-${draftIndex}`,
    draftIndex,
    draftRow: {
      ...fakeBaseExpense,
      name: `Expense ${draftIndex}`,
    },
    matches: [
      {
        source: DUPLICATE_SOURCE_NEW,
        draftIndex,
        row: {
          ...fakeBaseExpense,
          name: `Expense match ${draftIndex}`,
        },
      },
      {
        source: DUPLICATE_SOURCE_EXISTING,
        id: `existing-expense-${draftIndex}`,
        row: {
          id: `existing-expense-${draftIndex}`,
          userId: 'fake-user-id',
          accountId: 'fake-account-id',
          date: '2026-03-20',
          name: 'Existing expense',
          amount: 10,
          netAmount: 10,
          paidBackAmount: 0,
          category: {
            id: 'category-id',
            userId: 'fake-user-id',
            accountId: 'fake-account-id',
            name: 'Food',
            subCategories: [],
            createdAt: new Date('2026-01-01'),
            updatedAt: new Date('2026-01-01'),
          },
          subCategory: {
            id: 'sub-category-id',
            userId: 'fake-user-id',
            accountId: 'fake-account-id',
            name: 'Cafe',
            categoryId: 'category-id',
            createdAt: new Date('2026-01-01'),
            updatedAt: new Date('2026-01-01'),
          },
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
        },
      },
    ],
    isPresentInNew: true,
    isPresentInExisting: true,
  }
}

function createIncomeDuplicate(draftIndex: number): IncomeDuplicateEntry {
  return {
    type: DUPLICATE_ENTRY_TYPE_INCOME,
    duplicateKey: `income-${draftIndex}`,
    draftIndex,
    draftRow: {
      ...fakeBaseIncome,
      name: `Income ${draftIndex}`,
    },
    matches: [
      {
        source: DUPLICATE_SOURCE_NEW,
        draftIndex,
        row: {
          ...fakeBaseIncome,
          name: `Income match ${draftIndex}`,
        },
      },
      {
        source: DUPLICATE_SOURCE_EXISTING,
        id: `existing-income-${draftIndex}`,
        row: {
          id: `existing-income-${draftIndex}`,
          userId: 'fake-user-id',
          accountId: 'fake-account-id',
          name: 'Existing income',
          amount: 1000,
          date: '2026-03-20',
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
        },
      },
    ],
    isPresentInNew: true,
    isPresentInExisting: true,
  }
}

function resetStoreState() {
  mockStoreContext.newExpensesRef.value = []
  mockStoreContext.newIncomesRef.value = []
  mockStoreContext.expenseDuplicatesRef.value = []
  mockStoreContext.incomeDuplicatesRef.value = []
  mockStoreContext.isExpenseDuplicatesPresentRef.value = false
  mockStoreContext.isIncomeDuplicatesPresentRef.value = false
}

describe('when AddDataView is rendered', () => {
  beforeEach(() => {
    resetStoreState()
  })

  it('should keep duplicates button disabled when duplicates are not present', () => {
    render(AddDataView)

    const duplicatesButton = screen.getByRole('button', { name: 'Duplicates' })
    expect(duplicatesButton).toBeDisabled()
  })

  it('should keep duplicates button disabled on income tab when only expense duplicates are present', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.isIncomeDuplicatesPresentRef.value = false
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))

    const duplicatesButton = screen.getByRole('button', { name: 'Duplicates' })
    expect(duplicatesButton).toBeDisabled()
  })

  it('should enable duplicates button on income tab when income duplicates are present', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = false
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))

    const duplicatesButton = screen.getByRole('button', { name: 'Duplicates' })
    expect(duplicatesButton).toBeEnabled()
  })

  it('should enable duplicates button and open modal with expense tab by default', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    const duplicatesButton = screen.getByRole('button', { name: 'Duplicates' })
    expect(duplicatesButton).toBeEnabled()

    await userEvent.click(duplicatesButton)

    screen.getByText('Duplicate review')
    screen.getByText('Expense 0')
    screen.getByRole('columnheader', { name: 'Duplicates (new)' })
    screen.getByRole('columnheader', { name: 'Duplicates (existing)' })
    expect(screen.queryByText('Duplicates in new rows:')).toBeNull()
    expect(screen.queryByText('Duplicates in existing rows:')).toBeNull()
    expect(screen.queryByText('Income 0')).toBeNull()
  })

  it('should render only income duplicate groups when opened from income tab', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))
    await userEvent.click(screen.getByRole('button', { name: 'Duplicates' }))

    screen.getByText('Income 0')
    expect(screen.queryByText('Expense 0')).toBeNull()
    screen.getByRole('columnheader', { name: 'Duplicates (new)' })
    screen.getByRole('columnheader', { name: 'Duplicates (existing)' })
    expect(screen.queryByText('Duplicates in new rows:')).toBeNull()
    expect(screen.queryByText('Duplicates in existing rows:')).toBeNull()
  })

  it('should open duplicate modal on income tab when opened from income page tab', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))
    await userEvent.click(screen.getByRole('button', { name: 'Duplicates' }))

    screen.getByText('Income 0')
    expect(screen.queryByText('Expense 0')).toBeNull()
  })

  it('should remove expense draft row when expense duplicate remove action is clicked', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [
      { ...fakeBaseExpense },
      { ...fakeBaseExpense, name: 'Tea' },
    ]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Duplicates' }))
    await userEvent.click(screen.getByRole('button', { name: 'Remove draft row' }))

    expect(mockStoreContext.newExpensesRef.value).toHaveLength(1)
    expect(mockStoreContext.newExpensesRef.value[0].name).toBe('Tea')
  })

  it('should not remove expense draft row when duplicate draft index is stale', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(99)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Duplicates' }))
    await userEvent.click(screen.getByRole('button', { name: 'Remove draft row' }))

    expect(mockStoreContext.newExpensesRef.value).toHaveLength(1)
  })

  it('should continue expense save immediately when no expense duplicates exist', async () => {
    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('1')
    expect(screen.queryByText('Duplicate review')).toBeNull()
  })

  it('should open duplicate modal before expense save and continue after modal close', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    await screen.findByText('Duplicate review')
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
    screen.getByText('Expense 0')
    expect(screen.queryByText('Income 0')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    screen.getByRole('button', { name: 'Save data with duplicates' })

    await userEvent.click(screen.getByRole('button', { name: 'Save data with duplicates' }))

    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('1')
  })

  it('should cancel pending expense save when cancel save is clicked', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    await screen.findByText('Duplicate review')
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel save' }))

    expect(screen.queryByText('Duplicate review')).toBeNull()
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
  })

  it('should continue income save immediately when no income duplicates exist', async () => {
    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save Income Attempt' }))

    expect(screen.getByTestId('mock-income-save-continuations')).toHaveTextContent('1')
    expect(screen.queryByText('Duplicate review')).toBeNull()
  })

  it('should open duplicate modal before income save and continue after modal close', async () => {
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newIncomesRef.value = [{ ...fakeBaseIncome }]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save Income Attempt' }))

    await screen.findByText('Duplicate review')
    expect(screen.getByTestId('mock-income-save-continuations')).toHaveTextContent('0')
    screen.getByText('Income 0')
    expect(screen.queryByText('Expense 0')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    screen.getByRole('button', { name: 'Save data with duplicates' })

    await userEvent.click(screen.getByRole('button', { name: 'Save data with duplicates' }))

    expect(screen.getByTestId('mock-income-save-continuations')).toHaveTextContent('1')
  })

  it('should cancel pending income save when cancel save is clicked', async () => {
    mockStoreContext.isIncomeDuplicatesPresentRef.value = true
    mockStoreContext.newIncomesRef.value = [{ ...fakeBaseIncome }]
    mockStoreContext.incomeDuplicatesRef.value = [createIncomeDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Income' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save Income Attempt' }))

    await screen.findByText('Duplicate review')
    expect(screen.getByTestId('mock-income-save-continuations')).toHaveTextContent('0')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel save' }))

    expect(screen.queryByText('Duplicate review')).toBeNull()
    expect(screen.getByTestId('mock-income-save-continuations')).toHaveTextContent('0')
  })

  it('should show save data label when no duplicates remain during expense save review', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    await screen.findByText('Duplicate review')

    mockStoreContext.expenseDuplicatesRef.value = []

    await screen.findByRole('button', { name: 'Save data' })
    expect(screen.queryByRole('button', { name: 'Save data with duplicates' })).toBeNull()
  })

  it('should show close only and stop pending save when last expense draft row is removed in review', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    await screen.findByText('Duplicate review')
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
    await userEvent.click(screen.getByRole('button', { name: 'Remove draft row' }))

    await screen.findByRole('button', { name: 'Close' })
    expect(screen.queryByRole('button', { name: 'Cancel save' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Save data' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Save data with duplicates' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByText('Duplicate review')).toBeNull()
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
  })

  it('should show close only when only placeholder expense row remains during save review', async () => {
    mockStoreContext.isExpenseDuplicatesPresentRef.value = true
    mockStoreContext.newExpensesRef.value = [{ ...fakeBaseExpense }]
    mockStoreContext.expenseDuplicatesRef.value = [createExpenseDuplicate(0)]

    render(AddDataView)

    await userEvent.click(screen.getByRole('button', { name: 'Save Expense Attempt' }))

    await screen.findByText('Duplicate review')
    await userEvent.click(screen.getByRole('button', { name: 'Remove draft row' }))

    mockStoreContext.newExpensesRef.value = [
      {
        date: '2026-03-20',
        name: '',
        amount: 0,
        netAmount: 0,
        paidBackAmount: undefined,
        category: '',
        subCategory: '',
      },
    ]
    mockStoreContext.expenseDuplicatesRef.value = []

    await screen.findByRole('button', { name: 'Close' })
    expect(screen.queryByRole('button', { name: 'Cancel save' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Save data' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Save data with duplicates' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByText('Duplicate review')).toBeNull()
    expect(screen.getByTestId('mock-expense-save-continuations')).toHaveTextContent('0')
  })
})
