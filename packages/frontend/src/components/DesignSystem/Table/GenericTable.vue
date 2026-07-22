<script lang="ts" setup generic="T extends TableRowData">
import { computed } from 'vue'
import TableHeaders from '@/components/TableHeaders.vue'
import TableRow from './TableRow.vue'
import Button from '../Button/Button.vue'
import Error from '../Error.vue'
import LoadingModal from '../Modal/LoadingModal.vue'
import type { ColumnConfig, FilterValue, RowAction, RowKeyResolver, TableAction, TableRowData } from './types'
import { useProgressiveRowRender, useTableFilters } from './hooks'

const props = withDefaults(
  defineProps<{
    data: T[]
    columns: ColumnConfig<T>[]
    mode: 'editable' | 'view'
    rowActions?: RowAction<T>[]
    tableActions?: TableAction[]
    validationErrors?: number[]
    error?: Error
    loading?: boolean
    progressiveRender?: boolean
    initialRowCount?: number
    rowChunkSize?: number
    rowKey?: RowKeyResolver<T>
    stickyTopOffsetPx?: number
  }>(),
  {
    rowActions: () => [],
    tableActions: () => [],
    validationErrors: () => [],
    error: undefined,
    loading: false,
    progressiveRender: true,
    initialRowCount: undefined,
    rowChunkSize: undefined,
    rowKey: undefined,
    stickyTopOffsetPx: undefined,
  },
)

const emit = defineEmits<{
  'cell:changed': [rowIndex: number, key: keyof T, value: unknown]
}>()

const rowActions = computed(() => props.rowActions ?? [])
const tableActions = computed(() => props.tableActions ?? [])

const ZERO_COUNT = 0
const FALLBACK_ROW_KEY_INCREMENT = 1
let fallbackRowKeySequence = ZERO_COUNT
const fallbackRowKeys = new WeakMap<object, number>()

const { filterableColumns, filteredEntries, getDropdownOptions, activeFilters, setFilter } = useTableFilters<T>({
  data: computed(() => props.data),
  columns: computed(() => props.columns),
})

const { visibleData } = useProgressiveRowRender({
  data: filteredEntries,
  enabled: computed(() => props.progressiveRender),
  initialRowCount: computed(() => props.initialRowCount),
  rowChunkSize: computed(() => props.rowChunkSize),
})

// Build headers from columns config and add empty headers for row actions
const headers = computed(() => {
  const filterableKeys = new Set(filterableColumns.value.map((col) => col.key))
  const columnHeaders = props.columns.map((col) => {
    const filterable = filterableKeys.has(col.key)
    return {
      label: col.label,
      required: col.required,
      customClass: col.customClass,
      filterable,
      filterKey: col.key,
      filterType: filterable ? (col.type as 'dropdown' | 'date') : undefined,
      filterOptions: filterable && col.type === 'dropdown' ? getDropdownOptions(col) : undefined,
      filterValue: activeFilters.value[col.key],
    }
  })
  const actionHeaders = rowActions.value.map(() => ({
    label: '',
    required: false,
    filterable: false,
  }))
  return [...columnHeaders, ...actionHeaders]
})

const hasTableActions = computed(() => tableActions.value.length > ZERO_COUNT)
const validationErrorSet = computed(() => new Set(props.validationErrors ?? []))

function handleCellUpdate(rowIndex: number, key: keyof T, value: unknown) {
  emit('cell:changed', rowIndex, key, value)
}

function handleFilterChange(key: string, value: FilterValue) {
  setFilter(key, value)
}

function isRowInvalid(index: number): boolean {
  return validationErrorSet.value.has(index)
}

function getRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }

  if (typeof props.rowKey === 'string') {
    const configuredKey = row[props.rowKey]
    if (typeof configuredKey === 'string' || typeof configuredKey === 'number') {
      return configuredKey
    }
  }

  const idValue = 'id' in row ? (row as { id?: string | number | null | undefined }).id : undefined
  if (typeof idValue === 'string' || typeof idValue === 'number') {
    return idValue
  }

  if (typeof row === 'object' && row !== null) {
    const existingFallbackKey = fallbackRowKeys.get(row)
    if (existingFallbackKey !== undefined) {
      return existingFallbackKey
    }

    fallbackRowKeySequence += FALLBACK_ROW_KEY_INCREMENT
    fallbackRowKeys.set(row, fallbackRowKeySequence)
    return fallbackRowKeySequence
  }

  return index
}
</script>

<template>
  <div>
    <table class="w-full table-fixed mb-5">
      <TableHeaders
        :headers="headers"
        :sticky-top-offset-px="stickyTopOffsetPx"
        @filter:changed="handleFilterChange"
      />
      <tbody>
        <TableRow
          v-for="entry in visibleData"
          :key="getRowKey(entry.row, entry.index)"
          :row="entry.row"
          :row-index="entry.index"
          :columns="columns"
          :row-actions="rowActions"
          :mode="mode"
          :validation-error="isRowInvalid(entry.index)"
          @cell:changed="handleCellUpdate"
        />
      </tbody>
    </table>

    <!-- Table-level actions -->
    <div v-if="hasTableActions" class="flex gap-5">
      <Button
        v-for="(action, index) in tableActions"
        :key="index"
        :class="action.buttonClass"
        @click="action.handler"
      >
        {{ action.label }}
      </Button>
    </div>

    <!-- Error display -->
    <Error v-if="error" :error="error" />

    <!-- Loading modal -->
    <LoadingModal v-if="loading" :is-modal-open="loading" message="Processing..." />
  </div>
</template>
