import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TableCell from '../TableCell.vue'
import Input from '../../Input.vue'
import DropdownWithInput from '@/components/DropdownWithInput/DropdownWithInput.vue'
import type { ColumnConfig } from '../types'

type FakeRow = Record<string, unknown>

const defaultRow: FakeRow = { name: 'Test Name' }

function createColumn(overrides: Partial<ColumnConfig<FakeRow>> = {}): ColumnConfig<FakeRow> {
  return {
    key: 'name',
    label: 'Name',
    type: 'text',
    ...overrides,
  }
}

function mountTableCell(
  options: {
    column?: ColumnConfig<FakeRow>
    row?: FakeRow
    rowIndex?: number
    mode?: 'editable' | 'view'
  } = {},
) {
  return mount(TableCell<FakeRow>, {
    props: {
      column: options.column ?? createColumn(),
      row: options.row ?? defaultRow,
      rowIndex: options.rowIndex ?? 0,
      mode: options.mode ?? 'editable',
    },
  })
}

describe('TableCell', () => {
  describe('when in view mode', () => {
    it('should display formatted value as plain text', () => {
      const wrapper = mountTableCell({
        mode: 'view',
        column: createColumn(),
        row: { name: 'Test Name' },
      })

      expect(wrapper.find('p').text()).toBe('Test Name')
      expect(wrapper.findComponent(Input).exists()).toBe(false)
    })

    it('should format number values with 2 decimals', () => {
      const wrapper = mountTableCell({
        mode: 'view',
        column: createColumn({ key: 'amount', label: 'Amount', type: 'number' }),
        row: { amount: 123.456 },
      })

      expect(wrapper.find('p').text()).toBe('123.46')
    })

    it('should use custom format function when provided', () => {
      const wrapper = mountTableCell({
        mode: 'view',
        column: createColumn({
          key: 'status',
          label: 'Status',
          format: (value: string) => value.toUpperCase(),
        }),
        row: { status: 'active' },
      })

      expect(wrapper.find('p').text()).toBe('ACTIVE')
    })
  })

  describe('when in editable mode', () => {
    it('should render Input component for text type', () => {
      const wrapper = mountTableCell({
        column: createColumn(),
        row: { name: 'Test' },
      })

      expect(wrapper.findComponent(Input).exists()).toBe(true)
    })

    it('should render Input with type number for number columns', () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'amount', label: 'Amount', type: 'number' }),
        row: { amount: 100 },
      })

      const input = wrapper.findComponent(Input)
      expect(input.exists()).toBe(true)
      expect(input.props('type')).toBe('number')
    })

    it('should render Input with type date for date columns', () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'date', label: 'Date', type: 'date' }),
        row: { date: '2026-01-01' },
      })

      const input = wrapper.findComponent(Input)
      expect(input.exists()).toBe(true)
      expect(input.props('type')).toBe('date')
    })

    it('should render DropdownWithInput for dropdown type', () => {
      const wrapper = mountTableCell({
        column: createColumn({
          key: 'category',
          label: 'Category',
          type: 'dropdown',
          dropdownOptions: ['Option1', 'Option2'],
        }),
        row: { category: 'Option1' },
      })

      expect(wrapper.findComponent(DropdownWithInput).exists()).toBe(true)
    })
  })

  describe('when column has calculate function', () => {
    it('should display calculated value and not be editable', () => {
      const wrapper = mountTableCell({
        column: createColumn({
          key: 'total',
          label: 'Total',
          type: 'number',
          calculate: (row) => Number(row.price) * Number(row.quantity),
        }),
        row: { price: 10, quantity: 5 },
      })

      expect(wrapper.find('p').text()).toBe('50.00')
      expect(wrapper.findComponent(Input).exists()).toBe(false)
    })
  })

  describe('when column is explicitly non-editable', () => {
    it('should display as text even in editable mode', () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'id', label: 'ID', editable: false }),
        row: { id: '123' },
      })

      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.findComponent(Input).exists()).toBe(false)
    })
  })

  describe('when using dropdown with function-based options', () => {
    it('should call dropdownOptions function with row data', () => {
      const mockDropdownOptions = vi.fn((row: FakeRow) => [`Option for ${row.category}`])
      const fakeRow = { category: 'Food', subcategory: '' }
      const wrapper = mountTableCell({
        column: createColumn({
          key: 'subcategory',
          label: 'Subcategory',
          type: 'dropdown',
          dropdownOptions: mockDropdownOptions,
        }),
        row: fakeRow,
      })

      expect(mockDropdownOptions).toHaveBeenCalledWith(fakeRow)
      const dropdown = wrapper.findComponent(DropdownWithInput)
      expect(dropdown.props('dropdownOptions')).toEqual(['Option for Food'])
    })
  })

  describe('when column type is longtext', () => {
    it('should render Input component with textarea variant', () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Test description' },
      })

      const input = wrapper.findComponent(Input)
      expect(input.exists()).toBe(true)
      expect(input.props('variant')).toBe('textarea')
      expect(input.props('modelValue')).toBe('Test description')
    })

    it('should emit cell:changed on Shift+Enter', async () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Test' },
      })

      const input = wrapper.findComponent(Input)
      await input.vm.$emit(
        'keydown',
        new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }),
      )

      expect(wrapper.emitted('cell:changed')).toBeTruthy()
      expect(wrapper.emitted('cell:changed')![0]).toEqual(['description', 'Test'])
    })

    it('should not emit cell:changed immediately on plain Enter', async () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Test' },
      })

      const input = wrapper.findComponent(Input)
      await input.vm.$emit(
        'keydown',
        new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false }),
      )

      // Should not emit immediately (will debounce instead)
      expect(wrapper.emitted('cell:changed')).toBeFalsy()
    })

    it('should revert value on Escape key', async () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Original value' },
      })

      const input = wrapper.findComponent(Input)

      // Change the value
      await input.vm.$emit('update:modelValue', 'Modified value')
      await wrapper.vm.$nextTick()

      // Press Escape
      await input.vm.$emit('keydown', new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()

      // Value should be reverted to original
      expect(input.props('modelValue')).toBe('Original value')
    })

    it('should emit debounced cell:changed on regular input', async () => {
      vi.useFakeTimers()

      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Test' },
      })

      const input = wrapper.findComponent(Input)

      // Simulate typing (regular key)
      await input.vm.$emit('keydown', new KeyboardEvent('keydown', { key: 'a' }))

      // Should not emit immediately
      expect(wrapper.emitted('cell:changed')).toBeFalsy()

      // Fast-forward time by 1000ms (debounce delay)
      await vi.advanceTimersByTimeAsync(1000)

      // Should emit after debounce
      expect(wrapper.emitted('cell:changed')).toBeTruthy()

      vi.useRealTimers()
    })

    it('should display formatted value in view mode', () => {
      const wrapper = mountTableCell({
        column: createColumn({ key: 'description', label: 'Description', type: 'longtext' }),
        row: { description: 'Multi-line\ntext content' },
        mode: 'view',
      })

      expect(wrapper.find('p').text()).toBe('Multi-line\ntext content')
      expect(wrapper.findComponent(Input).exists()).toBe(false)
    })
  })
})
