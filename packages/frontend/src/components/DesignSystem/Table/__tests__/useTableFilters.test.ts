import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useTableFilters } from '../hooks/useTableFilters'
import { EMPTY_FILTER_VALUE } from '../types'
import type { ColumnConfig } from '../types'

interface FakeRow {
  id: number
  category: string
  subCategory: string
  date: string
  name: string
}

const baseRows: FakeRow[] = [
  { id: 1, category: 'Food', subCategory: 'Groceries', date: '2026-01-05', name: 'Row 1' },
  { id: 2, category: 'Food', subCategory: 'Restaurants', date: '2026-02-10', name: 'Row 2' },
  { id: 3, category: 'Travel', subCategory: 'Flights', date: '2026-03-15', name: 'Row 3' },
  { id: 4, category: '', subCategory: '', date: '2026-04-20', name: 'Row 4' },
]

const baseColumns: ColumnConfig<FakeRow>[] = [
  { key: 'category', label: 'Category', type: 'dropdown', filterable: true },
  { key: 'subCategory', label: 'Subcategory', type: 'dropdown', filterable: true },
  { key: 'date', label: 'Date', type: 'date', filterable: true },
  { key: 'name', label: 'Name', type: 'longtext', filterable: true },
]

function setupFilters(rows: FakeRow[] = baseRows, columns: ColumnConfig<FakeRow>[] = baseColumns) {
  const data = ref(rows)
  const columnsRef = ref(columns)
  return useTableFilters({
    data: computed(() => data.value),
    columns: computed(() => columnsRef.value),
  })
}

describe('useTableFilters', () => {
  describe('when computing filterableColumns', () => {
    it('should only include columns marked filterable with type dropdown or date', () => {
      const { filterableColumns } = setupFilters()

      expect(filterableColumns.value.map((column) => column.key)).toEqual([
        'category',
        'subCategory',
        'date',
      ])
    })

    it('should exclude a filterable column whose type is not dropdown or date', () => {
      const { filterableColumns } = setupFilters()

      expect(filterableColumns.value.some((column) => column.key === 'name')).toBe(false)
    })
  })

  describe('when deriving dropdown filter options', () => {
    it('should return deduped, sorted, non-empty distinct values from data, with the empty sentinel last', () => {
      const { getDropdownOptions } = setupFilters()
      const categoryColumn = baseColumns[0]

      expect(getDropdownOptions(categoryColumn)).toEqual(['Food', 'Travel', EMPTY_FILTER_VALUE])
    })

    it('should derive filter options from data even when dropdownOptions is a row-dependent function', () => {
      const subCategoryColumn: ColumnConfig<FakeRow> = {
        key: 'subCategory',
        label: 'Subcategory',
        type: 'dropdown',
        filterable: true,
        dropdownOptions: () => [],
      }
      const { getDropdownOptions } = setupFilters(baseRows, [subCategoryColumn])

      expect(getDropdownOptions(subCategoryColumn)).toEqual([
        'Flights',
        'Groceries',
        'Restaurants',
        EMPTY_FILTER_VALUE,
      ])
    })

    it('should not include the empty sentinel when no rows have an empty value', () => {
      const { getDropdownOptions } = setupFilters(baseRows.slice(0, 3))
      const categoryColumn = baseColumns[0]

      expect(getDropdownOptions(categoryColumn)).toEqual(['Food', 'Travel'])
    })
  })

  describe('when filtering by a dropdown column', () => {
    it('should only keep rows whose value is in the selected set, preserving original index', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('category', ['Travel'])

      expect(filteredEntries.value).toEqual([{ row: baseRows[2], index: 2 }])
    })

    it('should treat an empty selection as no filter', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('category', [])

      expect(filteredEntries.value).toHaveLength(baseRows.length)
    })
  })

  describe('when filtering by the empty sentinel on a dropdown column', () => {
    it('should keep only rows whose value is empty', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('category', [EMPTY_FILTER_VALUE])

      expect(filteredEntries.value).toEqual([{ row: baseRows[3], index: 3 }])
    })

    it('should combine with real values via OR, keeping rows matching either', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('category', ['Travel', EMPTY_FILTER_VALUE])

      expect(filteredEntries.value.map((entry) => entry.index)).toEqual([2, 3])
    })
  })

  describe('when filtering by a date column', () => {
    it('should keep rows on/after "from" only', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('date', { from: '2026-03-01' })

      expect(filteredEntries.value.map((entry) => entry.index)).toEqual([2, 3])
    })

    it('should keep rows on/before "to" only', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('date', { to: '2026-02-28' })

      expect(filteredEntries.value.map((entry) => entry.index)).toEqual([0, 1])
    })

    it('should keep rows within an inclusive from/to range', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('date', { from: '2026-02-01', to: '2026-03-31' })

      expect(filteredEntries.value.map((entry) => entry.index)).toEqual([1, 2])
    })
  })

  describe('when multiple filters are active', () => {
    it('should combine filters across columns with AND semantics', () => {
      const { setFilter, filteredEntries } = setupFilters()

      setFilter('category', ['Food'])
      setFilter('date', { from: '2026-02-01' })

      expect(filteredEntries.value).toEqual([{ row: baseRows[1], index: 1 }])
    })
  })

  describe('when clearing filters', () => {
    it('clearFilter should restore rows matching removed filter', () => {
      const { setFilter, clearFilter, filteredEntries } = setupFilters()

      setFilter('category', ['Travel'])
      clearFilter('category')

      expect(filteredEntries.value).toHaveLength(baseRows.length)
    })

    it('clearAllFilters should restore the full unfiltered entry set', () => {
      const { setFilter, clearAllFilters, filteredEntries } = setupFilters()

      setFilter('category', ['Travel'])
      setFilter('date', { from: '2026-03-01' })
      clearAllFilters()

      expect(filteredEntries.value).toHaveLength(baseRows.length)
    })
  })

  describe('when checking isColumnFiltered', () => {
    it('should be false before any filter is set', () => {
      const { isColumnFiltered } = setupFilters()

      expect(isColumnFiltered('category')).toBe(false)
    })

    it('should be true once a non-empty dropdown filter is set', () => {
      const { setFilter, isColumnFiltered } = setupFilters()

      setFilter('category', ['Travel'])

      expect(isColumnFiltered('category')).toBe(true)
    })

    it('should be false again once the filter is cleared', () => {
      const { setFilter, clearFilter, isColumnFiltered } = setupFilters()

      setFilter('category', ['Travel'])
      clearFilter('category')

      expect(isColumnFiltered('category')).toBe(false)
    })
  })
})
