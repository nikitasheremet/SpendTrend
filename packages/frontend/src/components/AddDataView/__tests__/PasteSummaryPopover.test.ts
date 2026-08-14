import { render, screen } from '@testing-library/vue'
import PasteSummaryPopover from '../PasteSummaryPopover.vue'

describe('PasteSummaryPopover', () => {
  it('shows both counts pluralized when expenses and incomes are added', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 3, incomeCount: 1 } })

    screen.getByText('3 expenses and 1 income added')
  })

  it('shows only the expense count when no incomes were added', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 5, incomeCount: 0 } })

    screen.getByText('5 expenses added')
  })

  it('shows only the income count when no expenses were added', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 0, incomeCount: 2 } })

    screen.getByText('2 incomes added')
  })

  it('uses singular wording for exactly one expense', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 1, incomeCount: 0 } })

    screen.getByText('1 expense added')
  })

  it('uses singular wording for exactly one income', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 0, incomeCount: 1 } })

    screen.getByText('1 income added')
  })

  it('uses singular wording on both sides when exactly one of each is added', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 1, incomeCount: 1 } })

    screen.getByText('1 expense and 1 income added')
  })

  it('shows a fallback message when nothing could be extracted', () => {
    render(PasteSummaryPopover, { props: { expenseCount: 0, incomeCount: 0 } })

    screen.getByText('No data could be extracted from the pasted info')
  })
})
