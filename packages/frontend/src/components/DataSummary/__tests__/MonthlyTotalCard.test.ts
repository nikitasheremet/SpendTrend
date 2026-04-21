import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthlyTotalCard from '../MonthlyTotalCard.vue'

describe('when rendering monthly total card occurs', () => {
  it('should render dash when percent difference is not relevant', () => {
    const wrapper = mount(MonthlyTotalCard, {
      props: {
        title: 'Expenses',
        topAmount: 0,
        threeMonthAvg: 200,
        changeAmount: -200,
        changePercent: undefined,
        isBetter: true,
      },
    })

    expect(wrapper.text()).toContain('-')
  })
})
