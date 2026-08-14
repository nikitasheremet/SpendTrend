import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { ColumnConfig, SortDirection, SortState, TableRowData } from '../types'
import type { TableFilterEntry } from './useTableFilters'

export interface UseTableSortOptions<T extends TableRowData> {
  columns: ComputedRef<ColumnConfig<T>[]>
}

export interface UseTableSortReturn<T extends TableRowData> {
  sortableColumns: ComputedRef<ColumnConfig<T>[]>
  sortState: Ref<SortState>
  sortedEntries: (entries: TableFilterEntry<T>[]) => TableFilterEntry<T>[]
  toggleSort: (key: string) => void
  getSortDirection: (key: string) => SortDirection | undefined
}

const ASCENDING = 'asc'
const DESCENDING = 'desc'
const BEFORE = -1
const AFTER = 1
const EQUAL = 0

function getRawValue<T extends TableRowData>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

function compareValues(a: unknown, b: unknown, type: ColumnConfig['type']): number {
  const aEmpty = isEmptyValue(a)
  const bEmpty = isEmptyValue(b)
  if (aEmpty && bEmpty) {
    return EQUAL
  }
  if (aEmpty) {
    return AFTER
  }
  if (bEmpty) {
    return BEFORE
  }

  if (type === 'number') {
    const aNum = Number(a)
    const bNum = Number(b)
    return aNum < bNum ? BEFORE : aNum > bNum ? AFTER : EQUAL
  }

  if (type === 'date') {
    const aTime = new Date(a as string).getTime()
    const bTime = new Date(b as string).getTime()
    return aTime < bTime ? BEFORE : aTime > bTime ? AFTER : EQUAL
  }

  return String(a).localeCompare(String(b))
}

export function useTableSort<T extends TableRowData>(options: UseTableSortOptions<T>): UseTableSortReturn<T> {
  const { columns } = options
  const sortState = ref<SortState>([]) as Ref<SortState>

  const sortableColumns = computed(() => columns.value.filter((column) => column.sortable === true))

  function getSortDirection(key: string): SortDirection | undefined {
    return sortState.value.find((rule) => rule.key === key)?.direction
  }

  function toggleSort(key: string): void {
    const currentDirection = getSortDirection(key)

    if (currentDirection === undefined) {
      sortState.value = [{ key, direction: ASCENDING }]
      return
    }

    if (currentDirection === ASCENDING) {
      sortState.value = [{ key, direction: DESCENDING }]
      return
    }

    sortState.value = []
  }

  function sortedEntries(entries: TableFilterEntry<T>[]): TableFilterEntry<T>[] {
    if (sortState.value.length === 0) {
      return entries
    }

    const columnsByKey = new Map<string, ColumnConfig<T>>(columns.value.map((column) => [column.key, column]))

    return [...entries].sort((entryA, entryB) => {
      for (const rule of sortState.value) {
        const columnType = columnsByKey.get(rule.key)?.type
        const comparison = compareValues(
          getRawValue(entryA.row, rule.key),
          getRawValue(entryB.row, rule.key),
          columnType,
        )
        if (comparison !== EQUAL) {
          return rule.direction === DESCENDING ? -comparison : comparison
        }
      }
      return EQUAL
    })
  }

  return {
    sortableColumns,
    sortState,
    sortedEntries,
    toggleSort,
    getSortDirection,
  }
}
