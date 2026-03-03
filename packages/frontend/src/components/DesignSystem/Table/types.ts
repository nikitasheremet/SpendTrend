export type CellType = 'text' | 'number' | 'date' | 'dropdown' | 'longtext'

export type TableRowData = object

export interface ColumnConfig<T extends TableRowData = TableRowData> {
  key: keyof T & string
  label: string
  type?: CellType
  required?: boolean
  editable?: boolean
  customClass?: string
  dropdownOptions?: string[] | ((row: T) => string[])
  format?: (value: unknown, row: T) => string
  calculate?: (row: T) => unknown
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
