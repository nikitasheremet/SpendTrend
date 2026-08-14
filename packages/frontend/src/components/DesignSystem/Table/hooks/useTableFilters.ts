import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type {
  ColumnConfig,
  DateFilterValue,
  FilterableColumnType,
  FilterState,
  FilterValue,
  TableRowData,
} from '../types'
import { EMPTY_FILTER_VALUE, FILTER_TYPE_DATE, FILTER_TYPE_DROPDOWN } from '../types'

const FILTERABLE_COLUMN_TYPES: readonly FilterableColumnType[] = [FILTER_TYPE_DROPDOWN, FILTER_TYPE_DATE]
const FILTERABLE_TYPES = new Set<string>(FILTERABLE_COLUMN_TYPES)

export interface TableFilterEntry<T extends TableRowData> {
  row: T
  index: number
}

export interface UseTableFiltersOptions<T extends TableRowData> {
  data: ComputedRef<T[]>
  columns: ComputedRef<ColumnConfig<T>[]>
}

export interface UseTableFiltersReturn<T extends TableRowData> {
  activeFilters: Ref<FilterState>
  filterableColumns: ComputedRef<ColumnConfig<T>[]>
  filteredEntries: ComputedRef<TableFilterEntry<T>[]>
  getDropdownOptions: (column: ColumnConfig<T>) => string[]
  setFilter: (key: string, value: FilterValue) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void
  isColumnFiltered: (key: string) => boolean
}

function getRawValue<T extends TableRowData>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

function matchesDropdownFilter<T extends TableRowData>(row: T, key: string, value: string[]): boolean {
  if (value.length === 0) {
    return true
  }
  const rawValue = getRawValue(row, key)
  if (isEmptyValue(rawValue)) {
    return value.includes(EMPTY_FILTER_VALUE)
  }
  return value.includes(String(rawValue))
}

function matchesDateFilter<T extends TableRowData>(row: T, key: string, value: DateFilterValue): boolean {
  const rawValue = getRawValue(row, key)
  if (typeof rawValue !== 'string' && !(rawValue instanceof Date)) {
    return false
  }

  const rowDate = new Date(rawValue)
  if (Number.isNaN(rowDate.getTime())) {
    return false
  }

  if (value.from) {
    const fromDate = new Date(value.from)
    if (!Number.isNaN(fromDate.getTime()) && rowDate < fromDate) {
      return false
    }
  }

  if (value.to) {
    const toDate = new Date(value.to)
    if (!Number.isNaN(toDate.getTime()) && rowDate > toDate) {
      return false
    }
  }

  return true
}

export function useTableFilters<T extends TableRowData>(
  options: UseTableFiltersOptions<T>,
): UseTableFiltersReturn<T> {
  const { data, columns } = options
  const activeFilters = ref<FilterState>({}) as Ref<FilterState>

  const filterableColumns = computed(() =>
    columns.value.filter((column) => column.filterable === true && FILTERABLE_TYPES.has(column.type ?? '')),
  )

  function getDropdownOptions(column: ColumnConfig<T>): string[] {
    const rawValues = data.value.map((row) => getRawValue(row, column.key))
    const hasEmptyValue = rawValues.some((value) => isEmptyValue(value))

    const values = rawValues.filter((value) => !isEmptyValue(value)).map((value) => String(value))
    const options = Array.from(new Set(values)).sort()

    return hasEmptyValue ? [...options, EMPTY_FILTER_VALUE] : options
  }

  function columnMatches(row: T, column: ColumnConfig<T>): boolean {
    const value = activeFilters.value[column.key]
    if (value === undefined) {
      return true
    }

    if (column.type === FILTER_TYPE_DROPDOWN) {
      return matchesDropdownFilter(row, column.key, value as string[])
    }

    if (column.type === FILTER_TYPE_DATE) {
      return matchesDateFilter(row, column.key, value as DateFilterValue)
    }

    return true
  }

  const filteredEntries = computed<TableFilterEntry<T>[]>(() =>
    data.value
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => filterableColumns.value.every((column) => columnMatches(row, column))),
  )

  function setFilter(key: string, value: FilterValue): void {
    activeFilters.value = { ...activeFilters.value, [key]: value }
  }

  function clearFilter(key: string): void {
    const { [key]: _removed, ...rest } = activeFilters.value
    activeFilters.value = rest
  }

  function clearAllFilters(): void {
    activeFilters.value = {}
  }

  function isColumnFiltered(key: string): boolean {
    const value = activeFilters.value[key]
    if (value === undefined) {
      return false
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return Boolean(value.from || value.to)
  }

  return {
    activeFilters,
    filterableColumns,
    filteredEntries,
    getDropdownOptions,
    setFilter,
    clearFilter,
    clearAllFilters,
    isColumnFiltered,
  }
}
