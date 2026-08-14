export type CellType = 'text' | 'number' | 'date' | 'dropdown' | 'longtext'

export type TableRowData = object

export type RowKeyResolver<T extends TableRowData = TableRowData> =
  | (keyof T & string)
  | ((row: T, index: number) => string | number)

export interface ColumnConfig<T extends TableRowData = TableRowData> {
  key: keyof T & string
  label: string
  type?: CellType
  required?: boolean
  editable?: boolean
  disabled?: boolean | ((row: T) => boolean)
  customClass?: string
  dropdownOptions?: string[] | ((row: T) => string[])
  dropdownSearchable?: boolean
  onCreateOption?: (searchText: string, row: T) => Promise<string>
  format?: (value: unknown, row: T) => string
  calculate?: (row: T) => unknown
  filterable?: boolean
  sortable?: boolean
}

export interface DateFilterValue {
  from?: string
  to?: string
}

export type FilterValue = string[] | DateFilterValue

export type FilterState = Record<string, FilterValue>

// Column types that support filtering. Add new filter UIs (e.g. 'number') here only.
export const FILTER_TYPE_DROPDOWN = 'dropdown'
export const FILTER_TYPE_DATE = 'date'

export type FilterableColumnType = typeof FILTER_TYPE_DROPDOWN | typeof FILTER_TYPE_DATE

// Sentinel included in a dropdown filter's options/selection to represent
// rows whose value is undefined, null, or ''. Never a real column value.
export const EMPTY_FILTER_VALUE = '__EMPTY__'
export const EMPTY_FILTER_LABEL = '(Empty)'

export type SortDirection = 'asc' | 'desc'

// A single column's sort rule. Modeled as an array (SortState) rather than a
// single optional rule so a future multi-column sort ticket only needs to
// change the composable's internals, not this contract or its consumers.
export interface SortRule {
  key: string
  direction: SortDirection
}

export type SortState = SortRule[]

export interface TableHeader {
  label: string
  required?: boolean
  customClass?: string
  filterable?: boolean
  filterKey?: string
  filterType?: FilterableColumnType
  filterOptions?: string[]
  filterValue?: FilterValue
  sortable?: boolean
  sortKey?: string
  sortDirection?: SortDirection
}

export interface RowAction<T extends TableRowData = TableRowData> {
  label: string
  handler: (row: T, index: number) => void | Promise<void>
  show?: (row: T, index: number) => boolean
  buttonClass?: string
}

export interface TableAction {
  label: string
  handler: () => void | Promise<void>
  buttonClass?: string
}
