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
- **Column Filtering**: Excel/Sheets-style header filters for `dropdown` and `date` columns (see [Filtering](#filtering))
- **Column Sorting**: Single-column, 3-state header sort (unsorted → asc → desc) (see [Sorting](#sorting))
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
  type?: 'text' | 'number' | 'date' | 'dropdown' | 'longtext' // Cell input type
  required?: boolean // Show asterisk in header
  editable?: boolean // Allow editing (default: true)
  customClass?: string // Tailwind classes for column
  dropdownOptions?: string[] | ((row: T) => string[]) // Static or dynamic options
  format?: (value: any, row: T) => string // Custom display formatter
  calculate?: (row: T) => any // Computed value function
  filterable?: boolean // Show a header filter control (dropdown/date columns only, see Filtering)
  sortable?: boolean // Show a header sort control (see Sorting)
}
```

## Filtering

Columns of type `dropdown` or `date` can opt into a header filter by setting
`filterable: true`. Filtering for other column types (`text`, `number`,
`longtext`) is not implemented yet — `filterable` on those types is a no-op
(no filter icon renders).

```typescript
const columns = computed<ColumnConfig<Expense>[]>(() => [
  { key: 'date', label: 'Date', type: 'date', filterable: true },
  { key: 'category', label: 'Category', type: 'dropdown', filterable: true, dropdownOptions: categoryNames },
  { key: 'name', label: 'Name', type: 'longtext' }, // not filterable
])
```

- **The table resolves filter options itself.** For `dropdown` columns, the
  filter's checklist is built from the distinct values actually present in
  `data` for that column — not from `dropdownOptions`. `dropdownOptions`
  describes what's *editable* into a cell (which may include values not yet
  present in any row); the filter only ever offers values a user could
  actually match, the same way Excel/Sheets does. Callers never pass a
  separate list of filter options.
- **Dropdown filters can match empty values.** If any row has `undefined`,
  `null`, or `''` for a filterable dropdown column, the checklist gets an
  extra `(Empty)` option (`EMPTY_FILTER_VALUE` in `types.ts`) that matches
  those rows. It behaves like any other option — combinable with real values
  via OR, included by "Select all", cleared by "Clear".
- **Date columns filter by range.** Instead of a checklist, `date` columns
  get a `from`/`to` range panel (inclusive bounds).
- Clicking the filter icon in a header cell opens a floating panel
  (`TableColumnFilter.vue`), which teleports to `<body>` and positions
  itself via the same `useDropdownPosition` hook used by
  `DropdownWithInput`/`Select.vue`, so it isn't clipped by table scroll
  containers.
- Filtering is implemented as the `useTableFilters` composable
  (`hooks/useTableFilters.ts`), which `GenericTable.vue` owns internally.
  It takes `data` + `columns` and returns rows **paired with their original
  index** (`{ row: T; index: number }[]`) rather than a plain filtered
  array — `GenericTable` renders using that original index, not the row's
  position among currently-visible rows. This matters because `rowActions`,
  `validationErrors` (a `Set<number>`), and the `cell:changed` emit are all
  addressed by index against the *full*, unfiltered `data` array; losing
  the original index when filtering would silently break edits, row
  actions, and validation highlighting on any filtered table.
- **Pipeline shape for a future search ticket:** a future `useTableSearch`
  composable should follow the same `{ row, index }[]` in/out shape as
  `useTableFilters` and `useTableSort`, so it can be composed into a
  `search → filter → sort` pipeline without `GenericTable.vue` needing to
  special-case all three at once. Extend this shape rather than inventing a
  new one.

## Sorting

Any column can opt into a header sort control by setting `sortable: true`.
Clicking it cycles the column through three states: **unsorted → ascending →
descending → unsorted**.

```typescript
const columns = computed<ColumnConfig<Expense>[]>(() => [
  { key: 'date', label: 'Date', type: 'date', sortable: true },
  { key: 'amount', label: 'Amount', type: 'number', sortable: true },
  { key: 'name', label: 'Name', type: 'text' }, // not sortable
])
```

- **Only one column can be sorted at a time.** Clicking sort on a different
  column replaces the active sort entirely — the previous column returns to
  unsorted and the new column starts at ascending. This mirrors "sort from
  the first column will be removed, and the sort will be applied to the
  next" from the feature spec.
- **Header glyph reflects state:** `↕` (unsorted, muted), `↑` (ascending),
  `↓` (descending). These are plain line arrows, deliberately different
  from the filter button's filled `▼` triangle, so the two controls aren't
  confused for one another at a glance.
- **Comparison is type-aware:** `number` columns compare numerically, `date`
  columns parse and compare as dates, everything else falls back to
  `localeCompare`. Rows with an empty value (`undefined`, `null`, or `''`)
  always sort to the end, regardless of direction.
- **Sorting composes with filtering.** `GenericTable.vue` chains
  `filter → sort`: `useTableFilters` produces `filteredEntries`, which is
  passed into `useTableSort`'s `sortedEntries()` before progressive
  rendering. Sorting only ever reorders the currently-filtered rows; it
  never changes which rows are visible.
- **Original row index is preserved**, same as filtering — sorting only
  reorders the `{ row, index }[]` array, so `rowActions`, `validationErrors`,
  and `cell:changed` continue to address the *original*, unsorted/unfiltered
  `data` array correctly.
- Sorting is implemented as the `useTableSort` composable
  (`hooks/useTableSort.ts`), which `GenericTable.vue` owns internally. Its
  sort state (`SortState`) is modeled as an array of `{ key, direction }`
  rules rather than a single optional rule — today the array only ever holds
  0 or 1 entries (enforced by `useTableSort`, not the type), but this means a
  future multi-column sort ticket only has to change `useTableSort`'s
  internals, not this type contract or `GenericTable.vue`'s wiring.

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
- `GenericTable.test.ts` - Table structure, modes, events, filtering, sorting
- `TableColumnFilter.test.ts` - Filter panel rendering and interactions
- `useTableFilters.test.ts` - Filter state, option derivation, index-preserving filtering
- `useTableSort.test.ts` - Sort cycle, single-column constraint, type-aware comparison, index-preserving sort
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
├── TableColumnFilter.vue     # Floating header filter panel (dropdown/date)
├── types.ts                  # TypeScript interfaces
├── index.ts                  # Public exports
├── hooks/
│   ├── useTableOperations.ts # CRUD operations hook
│   ├── useTableOperations.spec.ts
│   ├── useTableFilters.ts    # Filtering composable ({ row, index }[] pipeline)
│   ├── useTableSort.ts       # Sorting composable ({ row, index }[] pipeline)
│   ├── useProgressiveRowRender.ts
│   └── index.ts
└── __tests__/
    ├── TableCell.test.ts
    ├── TableRow.test.ts
    ├── GenericTable.test.ts
    ├── TableColumnFilter.test.ts
    ├── useTableFilters.test.ts
    └── useTableSort.test.ts
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

- Search (see [Filtering](#filtering)/[Sorting](#sorting) for the `{ row, index }[]` pipeline shape to extend)
- Multi-column sort (see [Sorting](#sorting) — `SortState` is already shaped as an array for this)
- `filterable` support for `text`/`number` columns
- Pagination
- Row selection with bulk actions
- Column reordering
- Export to CSV/Excel
- Inline row expansion
- Virtual scrolling for large datasets
