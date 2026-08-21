import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableSearchBar from '../TableSearchBar.vue'

function mountSearchBar(overrides: Record<string, unknown> = {}) {
  return mount(TableSearchBar, {
    props: {
      modelValue: '',
      ...overrides,
    },
  })
}

describe('TableSearchBar', () => {
  it('should render a search landmark with a text input and placeholder', () => {
    const wrapper = mountSearchBar()

    const landmark = wrapper.find('[role="search"][aria-label="Search table"]')
    expect(landmark.exists()).toBe(true)

    const input = wrapper.find('input[placeholder="Search…"]')
    expect(input.exists()).toBe(true)
  })

  it('should emit update:modelValue with the typed text', async () => {
    const wrapper = mountSearchBar()

    const input = wrapper.find('input[placeholder="Search…"]')
    await input.setValue('groceries')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['groceries'])
  })

  it('should pin the bar at the provided sticky offset', () => {
    const wrapper = mountSearchBar({ stickyTopOffsetPx: 48 })

    const stickyContainer = wrapper.find('.sticky')
    expect(stickyContainer.exists()).toBe(true)
    expect(stickyContainer.attributes('style')).toContain('top: 48px')
  })
})
