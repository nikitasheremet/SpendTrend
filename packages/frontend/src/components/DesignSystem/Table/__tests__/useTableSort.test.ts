import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useTableSort } from '../hooks/useTableSort'
import type { TableFilterEntry } from '../hooks/useTableFilters'
import type { ColumnConfig } from '../types'

interface FakeRow {
  id: number
  name: string
  amount: number
  date: string
  category: string
}

const baseRows: FakeRow[] = [
  { id: 1, name: 'Charlie', amount: 30, date: '2026-03-15', category: 'Food' },
  { id: 2, name: 'Alice', amount: 10, date: '2026-01-05', category: 'Travel' },
  { id: 3, name: 'Bob', amount: 20, date: '2026-02-10', category: 'Food' },
]

const baseColumns: ColumnConfig<FakeRow>[] = [
  { key: 'name', label: 'Name', type: 'text', sortable: true },
  { key: 'amount', label: 'Amount', type: 'number', sortable: true },
  { key: 'date', label: 'Date', type: 'date', sortable: true },
  { key: 'category', label: 'Category', type: 'dropdown', filterable: true },
]

function toEntries(rows: FakeRow[]): TableFilterEntry<FakeRow>[] {
  return rows.map((row, index) => ({ row, index }))
}

function setupSort(columns: ColumnConfig<FakeRow>[] = baseColumns) {
  const columnsRef = ref(columns)
  return useTableSort<FakeRow>({
    columns: computed(() => columnsRef.value),
  })
}

describe('useTableSort', () => {
  describe('when computing sortableColumns', () => {
    it('should only include columns marked sortable', () => {
      const { sortableColumns } = setupSort()

      expect(sortableColumns.value.map((column) => column.key)).toEqual(['name', 'amount', 'date'])
    })
  })

  describe('when cycling a single column through the 3-state sort', () => {
    it('should go unsorted -> asc -> desc -> unsorted', () => {
      const { toggleSort, getSortDirection } = setupSort()

      expect(getSortDirection('name')).toBeUndefined()

      toggleSort('name')
      expect(getSortDirection('name')).toBe('asc')

      toggleSort('name')
      expect(getSortDirection('name')).toBe('desc')

      toggleSort('name')
      expect(getSortDirection('name')).toBeUndefined()
    })
  })

  describe('when toggling a column that is not sortable', () => {
    it('should ignore the request and leave sort state unchanged', () => {
      const { toggleSort, getSortDirection, sortState } = setupSort()

      toggleSort('category')

      expect(getSortDirection('category')).toBeUndefined()
      expect(sortState.value).toEqual([])
    })
  })

  describe('when switching sort to a different column', () => {
    it('should clear the previous column and start the new one at asc', () => {
      const { toggleSort, getSortDirection } = setupSort()

      toggleSort('name')
      toggleSort('name')
      expect(getSortDirection('name')).toBe('desc')

      toggleSort('amount')

      expect(getSortDirection('name')).toBeUndefined()
      expect(getSortDirection('amount')).toBe('asc')
    })

    it('should never hold more than one active sort rule', () => {
      const { toggleSort, sortState } = setupSort()

      toggleSort('name')
      toggleSort('amount')
      toggleSort('date')

      expect(sortState.value).toEqual([{ key: 'date', direction: 'asc' }])
    })
  })

  describe('when sorting entries', () => {
    it('should return entries unchanged when no sort is active', () => {
      const { sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      expect(sortedEntries(entries)).toEqual(entries)
    })

    it('should ignore a sort rule for a non-sortable column even if forced directly into sortState', () => {
      const { sortState, sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      sortState.value = [{ key: 'category', direction: 'asc' }]

      expect(sortedEntries(entries)).toEqual(entries)
    })

    it('should sort strings ascending and descending', () => {
      const { toggleSort, sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      toggleSort('name')
      expect(sortedEntries(entries).map((entry) => entry.row.name)).toEqual(['Alice', 'Bob', 'Charlie'])

      toggleSort('name')
      expect(sortedEntries(entries).map((entry) => entry.row.name)).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('should sort numbers ascending and descending', () => {
      const { toggleSort, sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      toggleSort('amount')
      expect(sortedEntries(entries).map((entry) => entry.row.amount)).toEqual([10, 20, 30])

      toggleSort('amount')
      expect(sortedEntries(entries).map((entry) => entry.row.amount)).toEqual([30, 20, 10])
    })

    it('should sort dates ascending and descending', () => {
      const { toggleSort, sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      toggleSort('date')
      expect(sortedEntries(entries).map((entry) => entry.row.date)).toEqual([
        '2026-01-05',
        '2026-02-10',
        '2026-03-15',
      ])

      toggleSort('date')
      expect(sortedEntries(entries).map((entry) => entry.row.date)).toEqual([
        '2026-03-15',
        '2026-02-10',
        '2026-01-05',
      ])
    })

    it('should preserve the original index for each entry', () => {
      const { toggleSort, sortedEntries } = setupSort()
      const entries = toEntries(baseRows)

      toggleSort('name')

      expect(sortedEntries(entries).map((entry) => entry.index)).toEqual([1, 2, 0])
    })

    it('should sort rows with empty values to the end regardless of direction', () => {
      const rowsWithEmpty: FakeRow[] = [
        ...baseRows,
        { id: 4, name: '', amount: 0, date: '', category: '' },
      ]
      const { toggleSort, sortedEntries } = setupSort()
      const entries = toEntries(rowsWithEmpty)

      toggleSort('name')
      expect(sortedEntries(entries).map((entry) => entry.row.id)).toEqual([2, 3, 1, 4])

      toggleSort('name')
      expect(sortedEntries(entries).map((entry) => entry.row.id)).toEqual([1, 3, 2, 4])
    })
  })
})
