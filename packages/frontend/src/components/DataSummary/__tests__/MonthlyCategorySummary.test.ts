import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { ExpenseSummaryByCategory } from '@/types/dataSummary'
import MonthlyCategorySummary from '../MonthlyCategorySummary.vue'

const fakeSummaryForSelectedMonthByCategory = ref<ExpenseSummaryByCategory>([])

vi.mock('../helpers/useGetMonthlyExpenseSummary', () => ({
  UNCATEGORIZED_CATEGORY_ID: '__uncategorized__',
  useGetMonthlyExpenseSummary: () => ({
    summaryForSelectedMonthByCategory: fakeSummaryForSelectedMonthByCategory,
  }),
}))

function createFakeCategorySummary(params: {
  id: string
  name: string
  total: number
  threeMonthAvg: number
}) {
  return {
    id: params.id,
    name: params.name,
    total: params.total,
    threeMonthAvg: params.threeMonthAvg,
    diffTotalToAvg: params.total - params.threeMonthAvg,
    diffTotalToAvgAsPercent: undefined,
    subCategories: [],
    uncategorizedExpenses: [],
  }
}

describe('when rendering monthly category summary occurs', () => {
  beforeEach(() => {
    fakeSummaryForSelectedMonthByCategory.value = []
  })

  it('should keep uncategorized category as the last visible row', () => {
    fakeSummaryForSelectedMonthByCategory.value = [
      createFakeCategorySummary({
        id: 'fake-category-id-1',
        name: 'Food',
        total: 120,
        threeMonthAvg: 90,
      }),
      createFakeCategorySummary({
        id: '__uncategorized__',
        name: 'Uncategorized',
        total: 50,
        threeMonthAvg: 0,
      }),
      createFakeCategorySummary({
        id: 'fake-category-id-2',
        name: 'Transport',
        total: 70,
        threeMonthAvg: 20,
      }),
    ]

    const wrapper = mount(MonthlyCategorySummary, {
      props: {
        month: 2,
        year: 2026,
      },
    })

    const categoryNames = wrapper
      .findAll('.category-name')
      .map((rowWrapper) => rowWrapper.text().trim())

    expect(categoryNames).toEqual(['Food', 'Transport', 'Uncategorized'])
  })

  it('should hide categories that have zero total and zero three month average', () => {
    fakeSummaryForSelectedMonthByCategory.value = [
      createFakeCategorySummary({
        id: 'fake-category-id-1',
        name: 'Food',
        total: 10,
        threeMonthAvg: 0,
      }),
      createFakeCategorySummary({
        id: '__uncategorized__',
        name: 'Uncategorized',
        total: 0,
        threeMonthAvg: 0,
      }),
    ]

    const wrapper = mount(MonthlyCategorySummary, {
      props: {
        month: 2,
        year: 2026,
      },
    })

    const categoryNames = wrapper
      .findAll('.category-name')
      .map((rowWrapper) => rowWrapper.text().trim())

    expect(categoryNames).toEqual(['Food'])
  })
})
