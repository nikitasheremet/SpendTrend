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
  format?: (value: unknown, row: T) => string
  calculate?: (row: T) => unknown
  // Only honored for type: 'dropdown' | 'date'; other column types ignore this flag.
  filterable?: boolean
}

export interface DateFilterValue {
  from?: string
  to?: string
}

export type FilterValue = string[] | DateFilterValue

export type FilterState = Record<string, FilterValue>

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
