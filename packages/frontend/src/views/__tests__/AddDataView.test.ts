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
import { formatPastedBankData } from '@/helpers/bankInfoFormatting/formatPastedBankData'
import { DataType } from '@/helpers/bankInfoFormatting/bankInfoTypes'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import { createFailedPasteReport } from '@/gateway/failedPasteReport/createFailedPasteReport'
import { HttpError } from '@/gateway/httpError'
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

const mockFormatPastedBankData = vi.mocked(formatPastedBankData)

vi.mock('@/gateway/failedPasteReport/createFailedPasteReport', () => ({
  createFailedPasteReport: vi.fn(),
}))

const mockCreateFailedPasteReport = vi.mocked(createFailedPasteReport)

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
  mockFormatPastedBankData.mockReturnValue([])
}

function firePaste(textarea: HTMLElement, html: string) {
  firePasteWithClipboard(textarea, { html, text: '', types: ['text/html'] })
}

function firePasteWithClipboard(
  textarea: HTMLElement,
  clipboard: { html: string; text: string; types: string[] },
) {
  const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: {
      types: clipboard.types,
      getData: (format: string) => (format === 'text/html' ? clipboard.html : clipboard.text),
    },
  })
  textarea.dispatchEvent(pasteEvent)
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

const pasteTextareaPlaceholder =
  'Paste your bank data here. Copy it directly from your bank website'

describe('paste summary popover', () => {
  beforeEach(() => {
    resetStoreState()
  })

  it('shows expense and income counts when a mix of rows is pasted', async () => {
    mockFormatPastedBankData.mockReturnValue([
      { type: DataType.EXPENSE, date: '2026-03-20', name: 'Coffee', amount: 5 },
      { type: DataType.EXPENSE, date: '2026-03-20', name: 'Taxi', amount: 20 },
      { type: DataType.INCOME, date: '2026-03-20', name: 'Salary', amount: 1000 },
    ])
    const showPopoverMock = vi.fn()

    render(AddDataView, {
      global: { provide: { [POPOVER_SYMBOL]: ref({ showPopover: showPopoverMock }) } },
    })

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>')

    expect(showPopoverMock).toHaveBeenCalledTimes(1)
    expect(showPopoverMock).toHaveBeenCalledWith(
      expect.anything(),
      { expenseCount: 2, incomeCount: 1 },
      { timeout: 5000 },
    )
  })

  it('shows only the expense count when only expense rows are pasted', async () => {
    mockFormatPastedBankData.mockReturnValue([
      { type: DataType.EXPENSE, date: '2026-03-20', name: 'Coffee', amount: 5 },
    ])
    const showPopoverMock = vi.fn()

    render(AddDataView, {
      global: { provide: { [POPOVER_SYMBOL]: ref({ showPopover: showPopoverMock }) } },
    })

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>')

    expect(showPopoverMock).toHaveBeenCalledWith(
      expect.anything(),
      { expenseCount: 1, incomeCount: 0 },
      { timeout: 5000 },
    )
  })

  it('shows the popover for income-only pastes even while viewing the Expenses tab', async () => {
    mockFormatPastedBankData.mockReturnValue([
      { type: DataType.INCOME, date: '2026-03-20', name: 'Salary', amount: 1000 },
    ])
    const showPopoverMock = vi.fn()

    render(AddDataView, {
      global: { provide: { [POPOVER_SYMBOL]: ref({ showPopover: showPopoverMock }) } },
    })

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>')

    expect(showPopoverMock).toHaveBeenCalledWith(
      expect.anything(),
      { expenseCount: 0, incomeCount: 1 },
      { timeout: 5000 },
    )
  })

  it('shows a zero-count summary when nothing could be extracted from the paste', async () => {
    mockFormatPastedBankData.mockReturnValue([])
    const showPopoverMock = vi.fn()

    render(AddDataView, {
      global: { provide: { [POPOVER_SYMBOL]: ref({ showPopover: showPopoverMock }) } },
    })

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), 'not a table')

    expect(showPopoverMock).toHaveBeenCalledWith(
      expect.anything(),
      { expenseCount: 0, incomeCount: 0 },
      { timeout: 5000 },
    )
  })

  it('still adds pasted rows to the draft store when no popover is provided', async () => {
    mockFormatPastedBankData.mockReturnValue([
      { type: DataType.EXPENSE, date: '2026-03-20', name: 'Coffee', amount: 5 },
    ])

    render(AddDataView)

    expect(() =>
      firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>'),
    ).not.toThrow()

    expect(mockStoreContext.newExpensesRef.value).toHaveLength(1)
    expect(mockStoreContext.newExpensesRef.value[0].name).toBe('Coffee')
  })
})

describe('Failed Add Data Paste Report', () => {
  const failedPasteReportButtonName = 'Report a problem'

  function renderWithPopover() {
    const showPopoverMock = vi.fn()
    render(AddDataView, {
      global: { provide: { [POPOVER_SYMBOL]: ref({ showPopover: showPopoverMock }) } },
    })
    return showPopoverMock
  }

  async function pasteAndOpenReport() {
    firePasteWithClipboard(screen.getByPlaceholderText(pasteTextareaPlaceholder), {
      html: '<table><tr><td>Oct 3, 2026</td><td>COFFEE</td><td>$5.00</td></tr></table>',
      text: 'Oct 3, 2026\tCOFFEE\t$5.00',
      types: ['text/html', 'text/plain'],
    })
    await userEvent.click(await screen.findByRole('button', { name: failedPasteReportButtonName }))
  }

  async function fillInValidReport() {
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Bank' }), 'CIBC')
    await userEvent.type(screen.getByRole('textbox', { name: 'What went wrong?' }), 'No rows')
  }

  beforeEach(() => {
    resetStoreState()
    mockCreateFailedPasteReport.mockReset()
    mockCreateFailedPasteReport.mockResolvedValue(undefined)
  })

  it('keeps the report button disabled until an Add Data Paste has happened', () => {
    render(AddDataView)

    expect(screen.getByRole('button', { name: failedPasteReportButtonName })).toBeDisabled()

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>')

    return vi.waitFor(() =>
      expect(screen.getByRole('button', { name: failedPasteReportButtonName })).toBeEnabled(),
    )
  })

  it('sends the bank, message and details of the last paste', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-12T09:30:00.000Z'))
    mockFormatPastedBankData.mockReturnValue([
      { type: DataType.EXPENSE, date: '2026-10-03', name: 'COFFEE', amount: 5 },
      { type: DataType.EXPENSE, date: '2026-10-03', name: 'TAXI', amount: 20 },
      { type: DataType.INCOME, date: '2026-10-03', name: 'PAYROLL', amount: 1000 },
    ])
    render(AddDataView)

    await pasteAndOpenReport()
    vi.useRealTimers()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Bank' }), 'TD')
    await userEvent.type(
      screen.getByRole('textbox', { name: 'What went wrong?' }),
      'Payroll should be income',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    expect(mockCreateFailedPasteReport).toHaveBeenCalledWith({
      bank: 'TD',
      message: 'Payroll should be income',
      appVersion: __APP_VERSION__,
      userAgent: window.navigator.userAgent,
      pastedAt: '2026-10-12T09:30:00.000Z',
      clipboardTypes: ['text/html', 'text/plain'],
      expenseCount: 2,
      incomeCount: 1,
    })
  })

  it('thanks the user, closes the modal and disables the button until the next paste', async () => {
    const showPopoverMock = renderWithPopover()

    await pasteAndOpenReport()
    await fillInValidReport()
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    expect(showPopoverMock).toHaveBeenLastCalledWith(
      expect.anything(),
      { message: 'Thanks — your report was sent' },
      { timeout: 5000 },
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: failedPasteReportButtonName })).toBeDisabled()

    firePaste(screen.getByPlaceholderText(pasteTextareaPlaceholder), '<table></table>')

    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: failedPasteReportButtonName })).toBeEnabled(),
    )
  })

  it('blocks sending and explains why when the bank and message are missing', async () => {
    render(AddDataView)

    await pasteAndOpenReport()
    await userEvent.type(screen.getByRole('textbox', { name: 'What went wrong?' }), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    screen.getByText('Choose your bank')
    screen.getByText('Describe what went wrong, in up to 2000 characters')
    expect(mockCreateFailedPasteReport).not.toHaveBeenCalled()
  })

  it('blocks sending a message over 2000 characters', async () => {
    render(AddDataView)

    await pasteAndOpenReport()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Bank' }), 'CIBC')
    await userEvent.click(screen.getByRole('textbox', { name: 'What went wrong?' }))
    await userEvent.paste('x'.repeat(2001))
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    screen.getByText('Describe what went wrong, in up to 2000 characters')
    expect(mockCreateFailedPasteReport).not.toHaveBeenCalled()
  })

  it('only asks which bank when Other is picked, and requires it', async () => {
    render(AddDataView)

    await pasteAndOpenReport()
    expect(screen.queryByRole('textbox', { name: 'Which bank?' })).toBeNull()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Bank' }), 'Other')
    await userEvent.type(screen.getByRole('textbox', { name: 'What went wrong?' }), 'No rows')
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    screen.getByText("Enter your bank's name, in up to 100 characters")
    expect(mockCreateFailedPasteReport).not.toHaveBeenCalled()

    await userEvent.type(screen.getByRole('textbox', { name: 'Which bank?' }), ' Tangerine ')
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    expect(mockCreateFailedPasteReport).toHaveBeenCalledWith(
      expect.objectContaining({ bank: 'Other', otherBankName: 'Tangerine', message: 'No rows' }),
    )
  })

  it('blocks a bank name over 100 characters', async () => {
    render(AddDataView)

    await pasteAndOpenReport()
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Bank' }), 'Other')
    await userEvent.click(screen.getByRole('textbox', { name: 'Which bank?' }))
    await userEvent.paste('x'.repeat(101))
    await userEvent.type(screen.getByRole('textbox', { name: 'What went wrong?' }), 'No rows')
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    screen.getByText("Enter your bank's name, in up to 100 characters")
    expect(mockCreateFailedPasteReport).not.toHaveBeenCalled()
  })

  it.each([
    ['the request fails', new HttpError(500), "Your report couldn't be sent. Please try again."],
    [
      "reporting isn't configured",
      new HttpError(503),
      "Reporting isn't available right now, so your report couldn't be sent.",
    ],
    [
      'the network is down',
      new TypeError('Failed to fetch'),
      "Your report couldn't be sent. Please try again.",
    ],
  ])(
    'shows an error and keeps the modal and input when %s',
    async (_case, error, expectedMessage) => {
      mockCreateFailedPasteReport.mockRejectedValue(error)
      const showPopoverMock = renderWithPopover()

      await pasteAndOpenReport()
      await fillInValidReport()
      await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

      expect(showPopoverMock).toHaveBeenLastCalledWith(
        expect.anything(),
        { message: expectedMessage },
        { timeout: 5000, type: 'error' },
      )
      expect(screen.getByRole('combobox', { name: 'Bank' })).toHaveValue('CIBC')
      expect(screen.getByRole('textbox', { name: 'What went wrong?' })).toHaveValue('No rows')
      expect(screen.getByRole('button', { name: failedPasteReportButtonName })).toBeEnabled()
    },
  )

  it('tells the user what will be sent', async () => {
    render(AddDataView)

    await pasteAndOpenReport()

    screen.getByText(
      'We’ll send your bank, what went wrong, the app version, your browser, when you pasted, the clipboard formats and how many expenses and incomes were added, so we can fix the importer.',
    )
  })

  it('starts the next report with an empty form', async () => {
    render(AddDataView)

    await pasteAndOpenReport()
    await fillInValidReport()
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))
    await pasteAndOpenReport()

    expect(screen.getByRole('combobox', { name: 'Bank' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'What went wrong?' })).toHaveValue('')
  })

  it('disables sending while a report is on its way', async () => {
    let finishSending: () => void = () => {}
    mockCreateFailedPasteReport.mockReturnValue(
      new Promise<void>((resolve) => {
        finishSending = resolve
      }),
    )
    render(AddDataView)

    await pasteAndOpenReport()
    await fillInValidReport()
    await userEvent.click(screen.getByRole('button', { name: 'Send report' }))

    expect(screen.getByRole('button', { name: 'Send report' })).toBeDisabled()
    finishSending()
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(mockCreateFailedPasteReport).toHaveBeenCalledTimes(1)
  })
})
