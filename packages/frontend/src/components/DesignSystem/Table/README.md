# Generic Table Component

A flexible, reusable table component system built with Vue 3 and TypeScript, supporting both editable and view-only modes with a column-based configuration API.

## Features

- **Two Modes**: `editable` (always-editable cells) and `view` (read-only display)
- **Multiple Cell Types**: text, number, date, dropdown
- **Column Configuration**: Declarative column definitions with type safety
- **Row & Table Actions**: Customizable buttons with conditional visibility
- **Validation**: Row-level validation with visual feedback
- **Calculated Fields**: Support for computed/derived columns
- **Dependent Dropdowns**: Dynamic dropdown options based on row data
- **Popover Notifications**: Success/error notifications via inject/provide
- **Loading States**: Built-in loading modal support
- **Error Handling**: Integrated error display

## Components

### GenericTable.vue

Main table component that renders headers, rows, actions, and handles state management.

### TableRow.vue

Renders a single row with cells and row-level action buttons.

### TableCell.vue

Renders individual cells with mode-specific behavior (editable inputs vs read-only text).

## Hooks

### useTableOperations

Consolidated hook for managing table data, CRUD operations, validation, and state.

## Usage

### Basic Editable Table

```vue
<script setup lang="ts">
import { GenericTable, type ColumnConfig } from '@/components/DesignSystem/Table'

interface MyData {
  name: string
  amount: number
  date: string
}

const columns: ColumnConfig<MyData>[] = [
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'amount', label: 'Amount', type: 'number', required: true },
]

const data = ref<MyData[]>([{ name: 'Item 1', amount: 100, date: '2026-01-01' }])

function handleCellUpdate(rowIndex: number, key: keyof MyData, value: any) {
  data.value[rowIndex][key] = value
}
</script>

<template>
  <GenericTable :data="data" :columns="columns" mode="editable" @cell:changed="handleCellUpdate" />
</template>
```

### With useTableOperations Hook

```vue
<script setup lang="ts">
import {
  GenericTable,
  useTableOperations,
  type ColumnConfig,
  type TableAction,
} from '@/components/DesignSystem/Table'

interface MyData {
  name: string
  amount: number
}

const columns: ColumnConfig<MyData>[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'amount', label: 'Amount', type: 'number' },
]

const { rows, addRow, deleteRow, updateCell, saveAll, isLoading, error, validationErrors } =
  useTableOperations<MyData>({
    initialData: [],
    mode: 'editable',
    createEmptyRow: () => ({ name: '', amount: 0 }),
    onSave: async (items) => {
      await api.saveAll(items)
      return {}
    },
    validate: (items) => {
      return items
        .map((item, idx) => (!item.name || !item.amount ? idx : -1))
        .filter((idx) => idx >= 0)
    },
  })

const tableActions: TableAction[] = [
  { label: 'Add Row', handler: () => addRow() },
  { label: 'Save', handler: saveAll },
]
</script>

<template>
  <GenericTable
    :data="rows"
    :columns="columns"
    :table-actions="tableActions"
    :validation-errors="validationErrors"
    :error="error"
    :loading="isLoading"
    mode="editable"
    @cell:changed="updateCell"
  />
</template>
```

### View-Only Table

```vue
<script setup lang="ts">
import { GenericTable, type ColumnConfig } from '@/components/DesignSystem/Table'

const columns: ColumnConfig[] = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'total', label: 'Total', type: 'number', format: (val) => `$${val.toFixed(2)}` },
]

const data = ref([...])
</script>

<template>
  <GenericTable :data="data" :columns="columns" mode="view" />
</template>
```

### With Row Actions

```vue
<script setup lang="ts">
import { GenericTable, type ColumnConfig, type RowAction } from '@/components/DesignSystem/Table'

const rowActions: RowAction<MyData>[] = [
  {
    label: 'Delete',
    handler: async (row, index) => {
      await api.delete(row.id)
      data.value.splice(index, 1)
    },
    show: (row) => row.deletable, // Conditional visibility
  },
  {
    label: 'Edit',
    handler: (row) => router.push(`/edit/${row.id}`),
  },
]
</script>

<template>
  <GenericTable :data="data" :columns="columns" :row-actions="rowActions" mode="editable" />
</template>
```

### Calculated Fields

```vue
<script setup lang="ts">
const columns: ColumnConfig<Expense>[] = [
  { key: 'amount', label: 'Amount', type: 'number' },
  { key: 'paidBack', label: 'Paid Back', type: 'number' },
  {
    key: 'netAmount',
    label: 'Net Amount',
    type: 'number',
    editable: false,
    calculate: (row) => (row.amount || 0) - (row.paidBack || 0),
    format: (value) => value.toFixed(2),
  },
]
</script>
```

### Dependent Dropdowns

```vue
<script setup lang="ts">
const columns: ColumnConfig<Expense>[] = [
  {
    key: 'category',
    label: 'Category',
    type: 'dropdown',
    dropdownOptions: ['Food', 'Transport', 'Entertainment'],
  },
  {
    key: 'subcategory',
    label: 'Subcategory',
    type: 'dropdown',
    // Dynamic options based on selected category
    dropdownOptions: (row) => getSubcategoriesFor(row.category),
  },
]
</script>
```

## Column Configuration

### ColumnConfig Interface

```typescript
interface ColumnConfig<T = any> {
  key: string // Property key in data object
  label: string // Column header text
  type?: 'text' | 'number' | 'date' | 'dropdown' // Cell input type
  required?: boolean // Show asterisk in header
  editable?: boolean // Allow editing (default: true)
  customClass?: string // Tailwind classes for column
  dropdownOptions?: string[] | ((row: T) => string[]) // Static or dynamic options
  format?: (value: any, row: T) => string // Custom display formatter
  calculate?: (row: T) => any // Computed value function
}
```

### Row Action Configuration

```typescript
interface RowAction<T = any> {
  label: string // Button text
  handler: (row: T, index: number) => void | Promise<void>
  show?: (row: T, index: number) => boolean // Conditional visibility
  buttonClass?: string // Custom button styles
}
```

### Table Action Configuration

```typescript
interface TableAction {
  label: string // Button text
  handler: () => void | Promise<void>
  buttonClass?: string // Custom button styles
}
```

## useTableOperations Hook

### Options

```typescript
interface TableOperationsOptions<T> {
  initialData?: T[] // Starting data
  mode: 'editable' | 'view' // Table mode
  createEmptyRow: () => T // Factory for new rows
  onSave?: (items: T[]) => Promise<{ failedItems?: T[] }>
  onUpdate?: (item: T, key: keyof T, value: any) => Promise<T>
  onDelete?: (item: T, index: number) => Promise<void>
  validate?: (items: T[]) => number[] // Returns invalid row indices
  idKey?: keyof T // ID field name (default: 'id')
  popoverComponent?: any // Custom notification component
}
```

### Return Value

```typescript
interface TableOperationsReturn<T> {
  rows: Ref<T[]> // Reactive data array
  addRow: (template?: Partial<T>) => void // Add new row
  deleteRow: (index: number) => Promise<void> // Remove row
  updateCell: (index: number, key: keyof T, value: any) => Promise<void>
  saveAll: () => Promise<void> // Bulk save
  validateRows: () => number[] // Run validation
  clearAll: () => void // Reset to empty state
  isLoading: Ref<boolean> // Loading state
  error: Ref<Error | undefined> // Error state
  validationErrors: Ref<number[]> // Invalid row indices
}
```

## Migrated Components

The following components have been migrated to use GenericTable:

- ✅ [AddExpenseTable](../AddExpenseTable/AddExpenseTable.vue)
- ✅ [AddIncomeTable](../AddIncomeTable/AddIncomeTable.vue)
- ✅ [ExpenseDataTable](../ExpenseDataTable/ExpenseDataTable.vue)
- ✅ [IncomeDataTable](../IncomeDataTable/IncomeDataTable.vue)

## Testing

Comprehensive unit tests are available in `__tests__/`:

- `TableCell.test.ts` - Cell rendering, editing, formatting
- `TableRow.test.ts` - Row rendering, actions, validation
- `GenericTable.test.ts` - Table structure, modes, events
- `useTableOperations.spec.ts` - Hook CRUD operations, validation

Run tests:

```bash
cd packages/frontend
npm run test:unit
```

## TypeScript Support

All components and hooks are fully typed with generics for type-safe column definitions and data access.

## Architecture

```
Table/
├── GenericTable.vue          # Main table component
├── TableRow.vue              # Row wrapper with actions
├── TableCell.vue             # Individual cell with mode logic
├── types.ts                  # TypeScript interfaces
├── index.ts                  # Public exports
├── hooks/
│   ├── useTableOperations.ts # CRUD operations hook
│   ├── useTableOperations.spec.ts
│   └── index.ts
└── __tests__/
    ├── TableCell.test.ts
    ├── TableRow.test.ts
    └── GenericTable.test.ts
```

## Best Practices

1. **Use TypeScript generics** for type-safe column configs
2. **Validate early** using the `validate` option in `useTableOperations`
3. **Handle errors gracefully** - display them via the `error` prop
4. **Use calculated fields** for derived values - they automatically recalculate when dependencies change
5. **Leverage dependent dropdowns** for related field relationships
6. **Provide meaningful labels** and set `required` flags appropriately
7. **Use `cell:changed` event** for handling completed edits (fires after debounce for text/number, immediately for dropdowns/dates)

## Future Enhancements

- Sorting and filtering support
- Pagination
- Row selection with bulk actions
- Column reordering
- Export to CSV/Excel
- Inline row expansion
- Virtual scrolling for large datasets
