import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TableColumnFilter from '../TableColumnFilter.vue'
import { EMPTY_FILTER_VALUE } from '../types'
import type { DateFilterValue } from '../types'

// TableColumnFilter teleports its panel to document.body; without unmounting,
// a previous test's panel would linger and be picked up by querySelectorAll.
afterEach(() => {
  document.body.innerHTML = ''
})

function mountFilter(overrides: Record<string, unknown> = {}) {
  return mount(TableColumnFilter, {
    props: {
      filterKey: 'category',
      label: 'Category',
      type: 'dropdown',
      options: ['Food', 'Travel', 'Utilities'],
      modelValue: undefined,
      ...overrides,
    },
  })
}

function mountDateFilter(modelValue: DateFilterValue | undefined = undefined) {
  return mount(TableColumnFilter, {
    props: {
      filterKey: 'date',
      label: 'Date',
      type: 'date',
      modelValue,
    },
  })
}

async function openPanel(wrapper: ReturnType<typeof mountFilter>, label = 'Category') {
  await wrapper.find(`button[aria-label="Filter by ${label}"]`).trigger('click')
}

function panelButtons(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll('[data-table-column-filter-portal] button'))
}

function findPanelButton(text: string): HTMLButtonElement {
  const button = panelButtons().find((candidate) => candidate.textContent?.trim() === text)
  if (!button) {
    throw new Error(`No panel button found with text "${text}"`)
  }
  return button
}

describe('TableColumnFilter', () => {
  describe('when type is dropdown', () => {
    it('should render one checkbox per option once opened', async () => {
      const wrapper = mountFilter()
      await openPanel(wrapper)

      const checkboxes = document.querySelectorAll('[data-table-column-filter-portal] input[type="checkbox"]')
      expect(checkboxes).toHaveLength(3)
    })

    it('should emit update:modelValue with the toggled option added', async () => {
      const wrapper = mountFilter({ modelValue: [] })
      await openPanel(wrapper)

      const checkbox = document.querySelectorAll(
        '[data-table-column-filter-portal] input[type="checkbox"]',
      )[0] as HTMLInputElement
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['Food']])
    })

    it('should emit update:modelValue with the toggled option removed when unchecked', async () => {
      const wrapper = mountFilter({ modelValue: ['Food'] })
      await openPanel(wrapper)

      const checkbox = document.querySelectorAll(
        '[data-table-column-filter-portal] input[type="checkbox"]',
      )[0] as HTMLInputElement
      checkbox.checked = false
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    })

    it('should select all options when "Select all" is clicked', async () => {
      const wrapper = mountFilter({ modelValue: [] })
      await openPanel(wrapper)

      findPanelButton('Select all').dispatchEvent(new Event('click', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['Food', 'Travel', 'Utilities']])
    })

    it('should emit an empty array when "Clear" is clicked', async () => {
      const wrapper = mountFilter({ modelValue: ['Food', 'Travel'] })
      await openPanel(wrapper)

      findPanelButton('Clear').dispatchEvent(new Event('click', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    })

    it('should mark the trigger as active when a selection is present', () => {
      const wrapper = mountFilter({ modelValue: ['Food'] })

      const trigger = wrapper.find('button[aria-label="Filter by Category"]')
      expect(trigger.attributes('aria-pressed')).toBe('true')
    })

    it('should not mark the trigger as active when there is no selection', () => {
      const wrapper = mountFilter({ modelValue: [] })

      const trigger = wrapper.find('button[aria-label="Filter by Category"]')
      expect(trigger.attributes('aria-pressed')).toBe('false')
    })

    it('should render the empty-value sentinel option as "(Empty)"', async () => {
      const wrapper = mountFilter({ options: ['Food', EMPTY_FILTER_VALUE] })
      await openPanel(wrapper)

      const labels = Array.from(
        document.querySelectorAll('[data-table-column-filter-portal] label span'),
      ).map((span) => span.textContent)
      expect(labels).toEqual(['Food', '(Empty)'])
    })

    it('should toggle the empty-value sentinel into the selection like any other option', async () => {
      const wrapper = mountFilter({ options: ['Food', EMPTY_FILTER_VALUE], modelValue: [] })
      await openPanel(wrapper)

      const checkbox = document.querySelectorAll(
        '[data-table-column-filter-portal] input[type="checkbox"]',
      )[1] as HTMLInputElement
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[EMPTY_FILTER_VALUE]])
    })
  })

  describe('when type is date', () => {
    it('should render from/to date inputs once opened', async () => {
      const wrapper = mountDateFilter()
      await openPanel(wrapper, 'Date')

      const dateInputs = document.querySelectorAll('[data-table-column-filter-portal] input[type="date"]')
      expect(dateInputs).toHaveLength(2)
    })

    it('should emit update:modelValue with "from" set when the from input changes', async () => {
      const wrapper = mountDateFilter()
      await openPanel(wrapper, 'Date')

      const [fromInput] = document.querySelectorAll(
        '[data-table-column-filter-portal] input[type="date"]',
      ) as unknown as HTMLInputElement[]
      fromInput.value = '2026-01-01'
      fromInput.dispatchEvent(new Event('input', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ from: '2026-01-01', to: undefined }])
    })

    it('should emit update:modelValue with "to" set when the to input changes', async () => {
      const wrapper = mountDateFilter({ from: '2026-01-01' })
      await openPanel(wrapper, 'Date')

      const [, toInput] = document.querySelectorAll(
        '[data-table-column-filter-portal] input[type="date"]',
      ) as unknown as HTMLInputElement[]
      toInput.value = '2026-02-01'
      toInput.dispatchEvent(new Event('input', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
        { from: '2026-01-01', to: '2026-02-01' },
      ])
    })

    it('should emit an empty object when "Clear" is clicked', async () => {
      const wrapper = mountDateFilter({ from: '2026-01-01', to: '2026-02-01' })
      await openPanel(wrapper, 'Date')

      findPanelButton('Clear').dispatchEvent(new Event('click', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{}])
    })

    it('should mark the trigger as active when from or to is set', () => {
      const wrapper = mountDateFilter({ from: '2026-01-01' })

      const trigger = wrapper.find('button[aria-label="Filter by Date"]')
      expect(trigger.attributes('aria-pressed')).toBe('true')
    })
  })
})
