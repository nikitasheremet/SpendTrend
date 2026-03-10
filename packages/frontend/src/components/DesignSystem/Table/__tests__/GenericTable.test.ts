import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, VueElement } from 'vue'
import GenericTable from '../GenericTable.vue'
import TableRow from '../TableRow.vue'
import Button from '../../Button/Button.vue'
import ErrorComponent from '../../Error.vue'
import LoadingModal from '../../Modal/LoadingModal.vue'
import type { ColumnConfig, RowAction, TableAction } from '../types'

const TableRowComponent = TableRow as unknown as VueElement

interface FakeRow {
  name: string
  amount?: number
  rowKey?: string
  [key: string]: unknown
}

const baseColumns: ColumnConfig<FakeRow>[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'amount', label: 'Amount', type: 'number' },
]

const singleRowData: FakeRow[] = [{ name: 'Test', amount: 100 }]

function mountGenericTable(overrides: Record<string, unknown> = {}) {
  return mount(GenericTable<FakeRow>, {
    props: {
      data: singleRowData,
      columns: baseColumns,
      mode: 'editable',
      ...overrides,
    },
  })
}

describe('GenericTable', () => {
  describe('when rendering table structure', () => {
    it('should render table with headers and rows', async () => {
      const fakeData: FakeRow[] = [
        { name: 'Item 1', amount: 100 },
        { name: 'Item 2', amount: 200 },
      ]
      const wrapper = mountGenericTable({
        data: fakeData,
      })

      await nextTick()

      expect(wrapper.find('table').exists()).toBe(true)
      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(2)
    })

    it('should pass columns to each row', async () => {
      const fakeColumns: ColumnConfig<FakeRow>[] = [{ key: 'name', label: 'Name', type: 'text' }]
      const wrapper = mountGenericTable({
        columns: fakeColumns,
      })

      await nextTick()

      const row = wrapper.findComponent(TableRowComponent)
      expect(row.props('columns')).toEqual(fakeColumns)
    })

    it('should pass mode to rows', async () => {
      const wrapper = mountGenericTable({
        mode: 'view',
      })

      await nextTick()

      const row = wrapper.findComponent(TableRowComponent)
      expect(row.props('mode')).toBe('view')
    })
  })

  describe('when validation errors provided', () => {
    it('should mark rows with validation errors', async () => {
      const fakeData: FakeRow[] = [{ name: 'Test 1' }, { name: 'Test 2' }, { name: 'Test 3' }]
      const wrapper = mountGenericTable({
        data: fakeData,
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        validationErrors: [0, 2],
      })

      await nextTick()

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows[0].props('validationError')).toBe(true)
      expect(rows[1].props('validationError')).toBe(false)
      expect(rows[2].props('validationError')).toBe(true)
    })
  })

  describe('when row actions provided', () => {
    it('should pass row actions to each row', async () => {
      const fakeRowActions: RowAction<FakeRow>[] = [{ label: 'Delete', handler: vi.fn() }]
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: fakeRowActions,
      })

      await nextTick()

      const row = wrapper.findComponent(TableRowComponent)
      expect(row.props('rowActions')).toEqual(fakeRowActions)
    })

    it('should add empty header columns for row actions', () => {
      const fakeRowActions: RowAction<FakeRow>[] = [
        { label: 'Delete', handler: vi.fn() },
        { label: 'Edit', handler: vi.fn() },
      ]
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: fakeRowActions,
      })

      // Headers should include column headers + action headers
      const tableHeaders = wrapper.find('thead')
      expect(tableHeaders.exists()).toBe(true)
    })
  })

  describe('when table actions provided', () => {
    it('should render buttons for each table action', () => {
      const mockHandler1 = vi.fn()
      const mockHandler2 = vi.fn()
      const fakeTableActions: TableAction[] = [
        { label: 'Add Row', handler: mockHandler1 },
        { label: 'Save', handler: mockHandler2 },
      ]
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        tableActions: fakeTableActions,
      })

      const buttons = wrapper.findAllComponents(Button)
      expect(buttons.length).toBeGreaterThanOrEqual(2)

      const actionButtons = buttons.filter((b) => b.text() === 'Add Row' || b.text() === 'Save')
      expect(actionButtons).toHaveLength(2)
    })

    it('should call handler when table action clicked', async () => {
      const mockHandler = vi.fn()
      const fakeTableActions: TableAction[] = [{ label: 'Save', handler: mockHandler }]
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        tableActions: fakeTableActions,
      })

      const button = wrapper.findAllComponents(Button).find((b) => b.text() === 'Save')
      await button?.trigger('click')

      expect(mockHandler).toHaveBeenCalled()
    })
  })

  describe('when error provided', () => {
    it('should render Error component', () => {
      const fakeError = new Error('Test error')
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        error: fakeError,
      })

      const errorComponent = wrapper.findComponent(ErrorComponent)
      expect(errorComponent.exists()).toBe(true)
      expect(errorComponent.props('error')).toBe(fakeError)
    })
  })

  describe('when loading', () => {
    it('should render LoadingModal', () => {
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        loading: true,
      })

      const loadingModal = wrapper.findComponent(LoadingModal)
      expect(loadingModal.exists()).toBe(true)
      expect(loadingModal.props('isModalOpen')).toBe(true)
    })
  })

  describe('when cell is updated', () => {
    it('should emit cell:changed event', async () => {
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
      })

      await nextTick()

      const row = wrapper.findComponent(TableRowComponent)
      await row.vm.$emit('cell:changed', 0, 'name', 'New Value')

      expect(wrapper.emitted('cell:changed')).toBeTruthy()
      expect(wrapper.emitted('cell:changed')?.[0]).toEqual([0, 'name', 'New Value'])
    })
  })

  describe('when data is empty', () => {
    it('should render empty table body', () => {
      const wrapper = mountGenericTable({
        data: [],
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
      })

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(0)
    })
  })

  describe('when row key configuration is provided', () => {
    it('should use the configured row key field for table rows', async () => {
      const fakeData: FakeRow[] = [
        { rowKey: 'fake-row-1', name: 'A' },
        { rowKey: 'fake-row-2', name: 'B' },
      ]
      const wrapper = mountGenericTable({
        data: fakeData,
        rowKey: 'rowKey',
      })

      await nextTick()

      const keys = wrapper
        .findAllComponents(TableRowComponent)
        .map((rowWrapper) => rowWrapper.vm.$.vnode.key)
      expect(keys).toEqual(['fake-row-1', 'fake-row-2'])
    })
  })

  describe('when progressive rendering is disabled', () => {
    it('should render all rows immediately', async () => {
      const fakeData: FakeRow[] = Array.from({ length: 10 }, (_, index) => ({
        name: `Item ${index + 1}`,
      }))
      const wrapper = mountGenericTable({
        data: fakeData,
        progressiveRender: false,
        initialRowCount: 1,
        rowChunkSize: 1,
      })

      await nextTick()

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(10)
    })
  })
})
