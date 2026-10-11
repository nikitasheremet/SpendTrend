import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, type RenderOptions } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { mount } from '@vue/test-utils'
import TableRow from '../TableRow.vue'
import TableCell from '../TableCell.vue'
import Button from '../../Button/Button.vue'
import type { ColumnConfig, RowAction } from '../types'
import { VueElement } from 'vue'

const TableCellComponent = TableCell as unknown as VueElement

interface FakeRow {
  name: string
  amount?: number
  canDelete?: boolean
  [key: string]: unknown
}

const baseColumns: ColumnConfig<FakeRow>[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'amount', label: 'Amount', type: 'number' },
]

function mountTableRow(overrides: Record<string, unknown> = {}) {
  return mount(TableRow<FakeRow>, {
    props: {
      row: { name: 'Test', amount: 100 },
      rowIndex: 0,
      columns: baseColumns,
      mode: 'editable',
      ...overrides,
    },
  })
}

describe('TableRow', () => {
  describe('when rendering cells', () => {
    it('should render TableCell for each column', () => {
      const wrapper = mountTableRow()
      const cells = wrapper.findAllComponents(TableCellComponent)

      expect(cells).toHaveLength(2)
      expect(cells[0].props('column')).toEqual(baseColumns[0])
      expect(cells[1].props('column')).toEqual(baseColumns[1])
    })

    it('should pass row and rowIndex to each cell', () => {
      const fakeRow = { name: 'Test' }
      const wrapper = mountTableRow({
        row: fakeRow,
        rowIndex: 5,
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
      })

      const cell = wrapper.findComponent(TableCellComponent)
      expect(cell.props('row')).toEqual(fakeRow)
      expect(cell.props('rowIndex')).toBe(5)
    })

    it('should pass mode to cells', () => {
      const wrapper = mountTableRow({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        mode: 'view',
      })

      const cell = wrapper.findComponent(TableCellComponent)
      expect(cell.props('mode')).toBe('view')
    })
  })

  describe('when validation error present', () => {
    it('should apply error styling classes', () => {
      const wrapper = mountTableRow({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        validationError: true,
      })

      expect(wrapper.find('tr').classes()).toContain('bg-red-300/50')
      expect(wrapper.find('tr').classes()).toContain('hover:bg-red-300/50')
    })

    it('should not apply error styling when no validation error', () => {
      const wrapper = mountTableRow({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        validationError: false,
      })

      expect(wrapper.find('tr').classes()).not.toContain('bg-red-300/50')
    })
  })

  describe('when row actions provided', () => {
    it('should render button for each row action', () => {
      const fakeRowActions: RowAction<FakeRow>[] = [
        { label: 'Delete', handler: vi.fn() },
        { label: 'Edit', handler: vi.fn() },
      ]

      const wrapper = mountTableRow({
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: fakeRowActions,
      })

      const buttons = wrapper.findAllComponents(Button)
      expect(buttons).toHaveLength(2)
      expect(buttons[0].text()).toBe('Delete')
      expect(buttons[1].text()).toBe('Edit')
    })

    it('should call handler when action button clicked', async () => {
      const mockHandler = vi.fn()
      const fakeRow = { name: 'Test' }
      const wrapper = mountTableRow({
        row: fakeRow,
        rowIndex: 3,
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: [{ label: 'Delete', handler: mockHandler }],
      })

      await wrapper.findComponent(Button).trigger('click')

      expect(mockHandler).toHaveBeenCalledWith(fakeRow, 3)
    })

    it('should conditionally show actions based on show function', () => {
      const fakeRowActions: RowAction<FakeRow>[] = [
        {
          label: 'Delete',
          handler: vi.fn(),
          show: (row) => Boolean(row.canDelete),
        },
      ]

      const wrapper = mountTableRow({
        row: { name: 'Test', canDelete: false },
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: fakeRowActions,
      })

      const buttons = wrapper.findAllComponents(Button)
      expect(buttons).toHaveLength(0)
    })

    it('should show action when show function returns true', () => {
      const fakeRowActions: RowAction<FakeRow>[] = [
        {
          label: 'Delete',
          handler: vi.fn(),
          show: (row) => Boolean(row.canDelete),
        },
      ]

      const wrapper = mountTableRow({
        row: { name: 'Test', canDelete: true },
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
        rowActions: fakeRowActions,
      })

      const buttons = wrapper.findAllComponents(Button)
      expect(buttons).toHaveLength(1)
      expect(buttons[0].text()).toBe('Delete')
    })
  })

  describe('when cell is updated', () => {
    it('should emit cell:changed event with rowIndex', async () => {
      const wrapper = mountTableRow({
        row: { name: 'Test' },
        rowIndex: 2,
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
      })

      const cell = wrapper.findComponent(TableCellComponent)
      await cell.vm.$emit('cell:changed', 'name', 'New Value')

      expect(wrapper.emitted('cell:changed')).toBeTruthy()
      expect(wrapper.emitted('cell:changed')?.[0]).toEqual([2, 'name', 'New Value'])
    })

    it('should reset local edits when row prop is replaced', async () => {
      const wrapper = mountTableRow({
        row: { name: 'Original' },
        columns: [{ key: 'name', label: 'Name', type: 'text' }],
      })

      const cell = wrapper.findComponent(TableCellComponent)
      await cell.vm.$emit('local:update', 'name', 'Locally Edited')

      expect(cell.props('row').name).toBe('Locally Edited')

      await wrapper.setProps({ row: { name: 'Server Updated' } })

      const updatedCell = wrapper.findComponent(TableCellComponent)
      expect(updatedCell.props('row').name).toBe('Server Updated')
    })
  })
})

describe('TableRow row action loading state', () => {
  const nameColumn: ColumnConfig<FakeRow>[] = [{ key: 'name', label: 'Name', type: 'text' }]

  it('locks the clicked action button with a loading indicator until its handler settles', async () => {
    const deferred = createDeferred()
    renderRowWithActions([{ label: 'Delete', handler: () => deferred.promise }])
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeDisabled()
    expect(deleteButton).toHaveAttribute('aria-busy', 'true')

    deferred.resolve()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveAttribute('aria-busy')
  })

  it('does not call the handler again when clicked while still pending', async () => {
    const deferred = createDeferred()
    const handler = vi.fn(() => deferred.promise)
    renderRowWithActions([{ label: 'Delete', handler }])
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.dblClick(screen.getByRole('button', { name: 'Delete' }))

    expect(handler).toHaveBeenCalledTimes(1)
    deferred.resolve()
  })

  it('disables the row’s other actions while one is pending', async () => {
    const deferred = createDeferred()
    renderRowWithActions([
      { label: 'Delete', handler: () => deferred.promise },
      { label: '>> Income', handler: vi.fn() },
    ])
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const otherButton = screen.getByRole('button', { name: '>> Income' })
    expect(otherButton).toBeDisabled()
    expect(otherButton).not.toHaveAttribute('aria-busy')
    deferred.resolve()
  })

  it('unlocks the button when the handler fails so the user can retry', async () => {
    const deleteError = new Error('delete failed')
    const handler = vi.fn().mockRejectedValueOnce(deleteError).mockResolvedValueOnce(undefined)
    const errorHandler = vi.fn()
    renderRowWithActions([{ label: 'Delete', handler }], { config: { errorHandler } })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => expect(errorHandler).toHaveBeenCalled())
    expect(errorHandler.mock.calls[0][0]).toBe(deleteError)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(handler).toHaveBeenCalledTimes(2)
  })

  function renderRowWithActions(
    rowActions: RowAction<FakeRow>[],
    global: RenderOptions<typeof TableRow>['global'] = {},
  ) {
    return render(TableRow<FakeRow>, {
      props: {
        row: { name: 'Test' },
        rowIndex: 0,
        columns: nameColumn,
        mode: 'editable',
        rowActions,
      },
      global,
    })
  }

  function createDeferred() {
    let resolve!: () => void
    const promise = new Promise<void>((res) => {
      resolve = res
    })
    return { promise, resolve }
  }
})
