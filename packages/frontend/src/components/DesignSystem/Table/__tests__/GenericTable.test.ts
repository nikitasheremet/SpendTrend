import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, VueElement } from 'vue'
import GenericTable from '../GenericTable.vue'
import TableRow from '../TableRow.vue'
import Button from '../../Button/Button.vue'
import ErrorComponent from '../../Error.vue'
import LoadingModal from '../../Modal/LoadingModal.vue'
import type { ColumnConfig, RowAction, TableAction } from '../types'

// TableColumnFilter teleports its panel to document.body; without cleanup,
// a previous test's panel would linger and be picked up by document queries.
afterEach(() => {
  document.body.innerHTML = ''
})

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

  describe('when columns are filterable', () => {
    const filterableColumns: ColumnConfig<FakeRow>[] = [
      { key: 'name', label: 'Name', type: 'dropdown', filterable: true },
      { key: 'amount', label: 'Amount', type: 'number' },
    ]

    function findFilterTrigger(wrapper: ReturnType<typeof mountGenericTable>, label: string) {
      return wrapper.find(`button[aria-label="Filter by ${label}"]`)
    }

    it('should render a filter icon only for columns marked filterable', () => {
      const wrapper = mountGenericTable({ columns: filterableColumns })

      expect(findFilterTrigger(wrapper, 'Name').exists()).toBe(true)
      expect(findFilterTrigger(wrapper, 'Amount').exists()).toBe(false)
    })

    it('should not render a filter icon for a filterable text/number/longtext column', () => {
      const wrapper = mountGenericTable({
        columns: [{ key: 'name', label: 'Name', type: 'text', filterable: true }],
      })

      expect(findFilterTrigger(wrapper, 'Name').exists()).toBe(false)
    })

    it('should hide non-matching rows once a dropdown filter is selected', async () => {
      const fakeData: FakeRow[] = [
        { name: 'Food', amount: 1 },
        { name: 'Travel', amount: 2 },
      ]
      const wrapper = mountGenericTable({ data: fakeData, columns: filterableColumns })
      await nextTick()

      await findFilterTrigger(wrapper, 'Name').trigger('click')
      const checkbox = document.querySelector(
        '[data-table-column-filter-portal] input[type="checkbox"]',
      ) as HTMLInputElement
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(1)
      expect(rows[0].props('row')).toEqual({ name: 'Food', amount: 1 })
    })

    it('should preserve original row indices for cell:changed and row actions once filtered', async () => {
      const fakeData: FakeRow[] = [
        { name: 'Food', amount: 1 },
        { name: 'Travel', amount: 2 },
        { name: 'Food', amount: 3 },
      ]
      const rowActionHandler = vi.fn()
      const wrapper = mountGenericTable({
        data: fakeData,
        columns: filterableColumns,
        rowActions: [{ label: 'Delete', handler: rowActionHandler }],
      })
      await nextTick()

      await findFilterTrigger(wrapper, 'Name').trigger('click')
      const checkboxes = Array.from(
        document.querySelectorAll('[data-table-column-filter-portal] input[type="checkbox"]'),
      ) as HTMLInputElement[]
      const foodCheckbox = checkboxes.find((checkbox) => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('Food')
      })
      foodCheckbox?.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(2)

      const secondRow = rows[1]
      expect(secondRow.props('row')).toEqual({ name: 'Food', amount: 3 })
      expect(secondRow.props('rowIndex')).toBe(2)

      await secondRow.vm.$emit('cell:changed', 2, 'amount', 99)
      expect(wrapper.emitted('cell:changed')?.at(-1)).toEqual([2, 'amount', 99])

      const deleteButton = secondRow.findAllComponents(Button).find((b) => b.text() === 'Delete')
      await deleteButton?.trigger('click')
      expect(rowActionHandler).toHaveBeenCalledWith({ name: 'Food', amount: 3 }, 2)
    })

    it('should keep validationErrors targeting the original row index once earlier rows are filtered out', async () => {
      const fakeData: FakeRow[] = [
        { name: 'Food', amount: 1 },
        { name: 'Travel', amount: 2 },
        { name: 'Travel', amount: 3 },
      ]
      const wrapper = mountGenericTable({
        data: fakeData,
        columns: filterableColumns,
        validationErrors: [2],
      })
      await nextTick()

      await findFilterTrigger(wrapper, 'Name').trigger('click')
      const checkboxes = Array.from(
        document.querySelectorAll('[data-table-column-filter-portal] input[type="checkbox"]'),
      ) as HTMLInputElement[]
      const travelCheckbox = checkboxes.find((checkbox) => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('Travel')
      })
      travelCheckbox?.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()

      const rows = wrapper.findAllComponents(TableRowComponent)
      expect(rows).toHaveLength(2)
      expect(rows[0].props('validationError')).toBe(false)
      expect(rows[1].props('validationError')).toBe(true)
    })
  })
})
