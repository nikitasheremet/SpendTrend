import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { SORT_ASCENDING, SORT_DESCENDING, type ColumnConfig, type SortDirection, type SortState, type TableRowData } from '../types'
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

const BEFORE = -1
const AFTER = 1
const EQUAL = 0

export function useTableSort<T extends TableRowData>(options: UseTableSortOptions<T>): UseTableSortReturn<T> {
  const { columns } = options
  const sortState = ref<SortState>([]) as Ref<SortState>

  const sortableColumns = computed(() => columns.value.filter((column) => column.sortable === true))
  const sortableColumnsByKey = computed(
    () => new Map<string, ColumnConfig<T>>(sortableColumns.value.map((column) => [column.key, column])),
  )

  function getSortDirection(key: string): SortDirection | undefined {
    return sortState.value.find((rule) => rule.key === key)?.direction
  }

  function toggleSort(key: string): void {
    if (!sortableColumnsByKey.value.has(key)) {
      return
    }

    const currentDirection = getSortDirection(key)

    if (currentDirection === undefined) {
      sortState.value = [{ key, direction: SORT_ASCENDING }]
      return
    }

    if (currentDirection === SORT_ASCENDING) {
      sortState.value = [{ key, direction: SORT_DESCENDING }]
      return
    }

    sortState.value = []
  }

  function sortedEntries(entries: TableFilterEntry<T>[]): TableFilterEntry<T>[] {
    const activeRules = sortState.value.filter((rule) => sortableColumnsByKey.value.has(rule.key))
    if (activeRules.length === 0) {
      return entries
    }

    return [...entries].sort((entryA, entryB) => {
      for (const rule of activeRules) {
        const aValue = getRawValue(entryA.row, rule.key)
        const bValue = getRawValue(entryB.row, rule.key)
        const aEmpty = isEmptyValue(aValue)
        const bEmpty = isEmptyValue(bValue)

        // Empty values always sort last, regardless of sort direction.
        if (aEmpty && bEmpty) {
          continue
        }
        if (aEmpty) {
          return AFTER
        }
        if (bEmpty) {
          return BEFORE
        }

        const columnType = sortableColumnsByKey.value.get(rule.key)?.type
        const comparison = compareValues(aValue, bValue, columnType)
        if (comparison !== EQUAL) {
          return rule.direction === SORT_DESCENDING ? -comparison : comparison
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

function getRawValue<T extends TableRowData>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

function compareValues(a: unknown, b: unknown, type: ColumnConfig['type']): number {
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
