import { ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import AddExpenseTable from '../AddExpenseTable.vue'
import { useAddExpense } from '../hooks/useAddExpense'
import { NewExpense } from '@/types/expenseData'

vi.mock('../hooks/useAddExpense')

describe('AddExpenseTable', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  const renderOptions = {
    global: {
      stubs: {
        AddNewExpenseRow: {
          template: '<span />',
        },
      },
    },
  }
  const fakeUseAddExpenseResponse = {
    newExpenseData: ref({} as NewExpense),
    addExpense: vi.fn(),
    error: ref(undefined),
  }
  const mockUseAddExpense = vi.mocked(useAddExpense)

  it('should show error when error is returned from useAddExpense', () => {
    // Mock useAddExpense to return an error
    mockUseAddExpense.mockReturnValue({
      ...fakeUseAddExpenseResponse,
      error: ref(new Error('Some error message')),
    })

    render(AddExpenseTable, renderOptions)

    expect(screen.getByText('Error: Some error message')).toBeInTheDocument()
  })

  it('should render a save expense button', async () => {
    mockUseAddExpense.mockReturnValue(fakeUseAddExpenseResponse)

    render(AddExpenseTable, renderOptions)

    const button = screen.getByRole('button', { name: /save expense/i })

    expect(button).toBeInTheDocument()
  })
})
