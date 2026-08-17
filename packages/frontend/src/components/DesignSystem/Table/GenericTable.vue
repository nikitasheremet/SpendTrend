<script lang="ts" setup generic="T extends TableRowData">
import { computed, ref } from 'vue'
import TableHeaders from '@/components/TableHeaders.vue'
import { getThemeSpacingPx } from '@/helpers/css/getThemeSpacingPx'
import { useElementHeight } from '@/helpers/hooks/useElementHeight'
import TableRow from './TableRow.vue'
import TableSearchBar from './TableSearchBar.vue'
import Button from '../Button/Button.vue'
import Error from '../Error.vue'
import LoadingModal from '../Modal/LoadingModal.vue'
import type {
  ColumnConfig,
  FilterableColumnType,
  FilterValue,
  RowAction,
  RowKeyResolver,
  TableAction,
  TableRowData,
} from './types'
import { FILTER_TYPE_DROPDOWN } from './types'
import { useProgressiveRowRender, useTableFilters } from './hooks'

const {
  data,
  columns,
  mode,
  rowActions = [],
  tableActions = [],
  validationErrors = [],
  error,
  loading = false,
  progressiveRender = true,
  initialRowCount,
  rowChunkSize,
  rowKey,
  stickyTopOffsetPx,
} = defineProps<{
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
}>()

const emit = defineEmits<{
  'cell:changed': [rowIndex: number, key: keyof T, value: unknown]
}>()

const ZERO_COUNT = 0
const FALLBACK_ROW_KEY_INCREMENT = 1
let fallbackRowKeySequence = ZERO_COUNT
const fallbackRowKeys = new WeakMap<object, number>()

const {
  filterableColumns,
  searchableColumns,
  searchTerm,
  filteredEntries,
  getDropdownOptions,
  activeFilters,
  setFilter,
  setSearchTerm,
} = useTableFilters<T>({
  data: computed(() => data),
  columns: computed(() => columns),
})

const hasSearchBar = computed(() => searchableColumns.value.length > ZERO_COUNT)

// Resolve the base sticky offset once so the search bar and the header row
// share the same reference point (mirrors TableHeaders' standalone fallback).
const baseStickyTopOffsetPx = computed(() => stickyTopOffsetPx ?? getThemeSpacingPx('nav'))

// The search bar pins at the base offset; headers must then pin flush below it.
const searchBarRef = ref<HTMLElement | null>(null)
const searchBarHeight = useElementHeight(searchBarRef)
const headerStickyTopOffsetPx = computed(() =>
  hasSearchBar.value
    ? baseStickyTopOffsetPx.value + searchBarHeight.value
    : baseStickyTopOffsetPx.value,
)

const { visibleData } = useProgressiveRowRender({
  data: filteredEntries,
  enabled: computed(() => progressiveRender),
  initialRowCount: computed(() => initialRowCount),
  rowChunkSize: computed(() => rowChunkSize),
})

// Build headers from columns config and add empty headers for row actions
const headers = computed(() => {
  const filterableKeys = new Set(filterableColumns.value.map((col) => col.key))
  const columnHeaders = columns.map((col) => {
    const filterable = filterableKeys.has(col.key)
    return {
      label: col.label,
      required: col.required,
      customClass: col.customClass,
      filterable,
      filterKey: col.key,
      filterType: filterable ? (col.type as FilterableColumnType) : undefined,
      filterOptions: filterable && col.type === FILTER_TYPE_DROPDOWN ? getDropdownOptions(col) : undefined,
      filterValue: activeFilters.value[col.key],
    }
  })
  const actionHeaders = rowActions.map(() => ({
    label: '',
    required: false,
    filterable: false,
  }))
  return [...columnHeaders, ...actionHeaders]
})

const hasTableActions = computed(() => tableActions.length > ZERO_COUNT)
const validationErrorSet = computed(() => new Set(validationErrors))

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
  if (typeof rowKey === 'function') {
    return rowKey(row, index)
  }

  if (typeof rowKey === 'string') {
    const configuredKey = row[rowKey]
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
    <div v-if="hasSearchBar" ref="searchBarRef">
      <TableSearchBar
        :model-value="searchTerm"
        :sticky-top-offset-px="baseStickyTopOffsetPx"
        @update:model-value="setSearchTerm"
      />
    </div>
    <table class="w-full table-fixed mb-5">
      <TableHeaders
        :headers="headers"
        :sticky-top-offset-px="headerStickyTopOffsetPx"
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
