import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthlyCategorySummaryDetails from '../MonthlyCategorySummaryDetails.vue'
import { UNCATEGORIZED_CATEGORY_ID } from '../helpers/useGetMonthlyExpenseSummary'
import type { ExpenseCategorySummary } from '@/types/dataSummary'

function createFakeCategorySummary(params: {
  id: string
  name: string
  uncategorizedExpensesCount: number
}): ExpenseCategorySummary {
  const uncategorizedExpenses = Array.from(
    { length: params.uncategorizedExpensesCount },
    (_, index) => ({
      id: `fake-expense-${index}`,
      name: `Expense ${index}`,
      date: '2026-03-10',
      netAmount: 100 + index,
    }),
  )

  return {
    id: params.id,
    name: params.name,
    total: uncategorizedExpenses.reduce((total, expense) => total + expense.netAmount, 0),
    threeMonthAvg: 0,
    diffTotalToAvg: 0,
    diffTotalToAvgAsPercent: undefined,
    subCategories: [],
    uncategorizedExpenses,
  }
}

describe('when expanding monthly category summary details occurs', () => {
  it('should render uncategorized expense rows directly without subgroup row', async () => {
    const wrapper = mount(MonthlyCategorySummaryDetails, {
      props: {
        category: createFakeCategorySummary({
          id: UNCATEGORIZED_CATEGORY_ID,
          name: 'Uncategorized',
          uncategorizedExpensesCount: 2,
        }),
      },
    })

    await wrapper.find('.category-name').trigger('click')

    const uncategorizedGroupRow = wrapper.find('[data-testid="uncategorized-group-row"]')
    const expenseRows = wrapper.findAll('[data-testid="expense-detail-row"]')

    expect(uncategorizedGroupRow.exists()).toBe(false)
    expect(expenseRows).toHaveLength(2)
  })

  it('should render No SubCategory subgroup row for normal categories', async () => {
    const wrapper = mount(MonthlyCategorySummaryDetails, {
      props: {
        category: createFakeCategorySummary({
          id: 'fake-category-id',
          name: 'Food',
          uncategorizedExpensesCount: 1,
        }),
      },
    })

    await wrapper.find('.category-name').trigger('click')

    const uncategorizedGroupRow = wrapper.find('[data-testid="uncategorized-group-row"]')

    expect(uncategorizedGroupRow.exists()).toBe(true)
    expect(uncategorizedGroupRow.text()).toContain('No SubCategory')
  })
})
