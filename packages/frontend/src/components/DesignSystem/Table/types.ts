export type CellType = 'text' | 'number' | 'date' | 'dropdown' | 'longtext'

export interface ColumnConfig<T = any> {
  key: string
  label: string
  type?: CellType
  required?: boolean
  editable?: boolean
  customClass?: string
  dropdownOptions?: string[] | ((row: T) => string[])
  format?: (value: any, row: T) => string
  calculate?: (row: T) => any
}

export interface RowAction<T = any> {
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
