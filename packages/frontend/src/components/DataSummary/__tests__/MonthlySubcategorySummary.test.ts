import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthlySubcategorySummary from '../MonthlySubcategorySummary.vue'
import type { ExpenseSubCategorySummary, ExpenseSummaryListItem } from '@/types/dataSummary'

const fakeSubCategoryExpenses: ExpenseSummaryListItem[] = [
  {
    id: 'fake-expense-1',
    name: 'Gym annual fee',
    date: '2026-03-10',
    netAmount: 400,
  },
]

const fakeUncategorizedExpenses: ExpenseSummaryListItem[] = [
  {
    id: 'fake-expense-2',
    name: 'One-off admin fee',
    date: '2026-03-09',
    netAmount: 80,
  },
]

const fakeSubCategorySummary: ExpenseSubCategorySummary[] = [
  {
    id: 'fake-subcategory-1',
    name: 'Subscriptions',
    expenses: fakeSubCategoryExpenses,
    total: 400,
    threeMonthAvg: 200,
    diffTotalToAvg: 200,
    diffTotalToAvgAsPercent: 100,
  },
  {
    id: 'fake-subcategory-2',
    name: 'Utilities',
    expenses: [],
    total: 0,
    threeMonthAvg: 0,
    diffTotalToAvg: 0,
    diffTotalToAvgAsPercent: undefined,
  },
]

describe('when rendering monthly subCategory summary occurs', () => {
  it('should show subCategory groups before the No SubCategory group', () => {
    const wrapper = mount(MonthlySubcategorySummary, {
      props: {
        summaryForSelectedMonthBySubcategory: fakeSubCategorySummary,
        uncategorizedExpenses: fakeUncategorizedExpenses,
      },
    })

    const groupedRows = wrapper
      .findAll('[data-testid="subcategory-summary-row"], [data-testid="uncategorized-group-row"]')
      .map((rowWrapper) => rowWrapper.text())

    expect(groupedRows[0]).toContain('Subscriptions')
    expect(groupedRows[1]).toContain('Utilities')
    expect(groupedRows[2]).toContain('No SubCategory')
    expect(groupedRows[2]).toContain('80')
  })

  it('should toggle a subCategory row to display expense name, netAmount, and date', async () => {
    const wrapper = mount(MonthlySubcategorySummary, {
      props: {
        summaryForSelectedMonthBySubcategory: fakeSubCategorySummary,
        uncategorizedExpenses: [],
      },
    })

    const hiddenDetailRowsBefore = wrapper.findAll('[data-testid="expense-detail-row"]')
    expect(hiddenDetailRowsBefore).toHaveLength(1)
    expect(hiddenDetailRowsBefore[0].attributes('style')).toContain('display: none')

    const subcategoryRow = wrapper.findAll('[data-testid="subcategory-summary-row"]')[0]
    await subcategoryRow.find('td').trigger('click')

    const visibleDetailRowsAfter = wrapper.findAll('[data-testid="expense-detail-row"]')

    expect(visibleDetailRowsAfter).toHaveLength(1)
    expect(visibleDetailRowsAfter[0].attributes('style')).not.toContain('display: none')
    expect(visibleDetailRowsAfter[0].text()).toContain('(2026-03-10) Gym annual fee')
    expect(visibleDetailRowsAfter[0].text()).toContain('400')
  })

  it('should toggle the No SubCategory group to display uncategorized expenses', async () => {
    const wrapper = mount(MonthlySubcategorySummary, {
      props: {
        summaryForSelectedMonthBySubcategory: fakeSubCategorySummary,
        uncategorizedExpenses: fakeUncategorizedExpenses,
      },
    })

    const uncategorizedRow = wrapper.find('[data-testid="uncategorized-group-row"]')
    await uncategorizedRow.find('td').trigger('click')

    const visibleDetailRowsAfter = wrapper
      .findAll('[data-testid="expense-detail-row"]')
      .filter((rowWrapper) => !rowWrapper.attributes('style')?.includes('display: none'))

    expect(visibleDetailRowsAfter).toHaveLength(1)
    expect(visibleDetailRowsAfter[0].text()).toContain('(2026-03-09) One-off admin fee')
    expect(visibleDetailRowsAfter[0].text()).toContain('80')
  })
})
