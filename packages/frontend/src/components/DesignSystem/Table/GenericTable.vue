<script lang="ts" setup generic="T extends Record<string, any>">
import { computed } from 'vue'
import TableHeaders from '@/components/TableHeaders.vue'
import TableRow from './TableRow.vue'
import Button from '../Button/Button.vue'
import Error from '../Error.vue'
import LoadingModal from '../Modal/LoadingModal.vue'
import type { ColumnConfig, RowAction, TableAction } from './types'
import { useProgressiveRowRender } from './hooks'

const props = defineProps<{
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
}>()

const emit = defineEmits<{
  'cell:changed': [rowIndex: number, key: keyof T, value: any]
}>()

const rowActions = computed(() => props.rowActions ?? [])
const tableActions = computed(() => props.tableActions ?? [])
const { visibleData } = useProgressiveRowRender<T>({
  data: computed(() => props.data),
  enabled: computed(() => true),
  initialRowCount: computed(() => props.initialRowCount),
  rowChunkSize: computed(() => props.rowChunkSize),
})

// Build headers from columns config and add empty headers for row actions
const headers = computed(() => {
  const columnHeaders = props.columns.map((col) => ({
    label: col.label,
    required: col.required,
    customClass: col.customClass,
  }))
  const actionHeaders = rowActions.value.map(() => ({
    label: '',
    required: false,
  }))
  return [...columnHeaders, ...actionHeaders]
})

const hasTableActions = computed(() => tableActions.value.length > 0)
const validationErrorSet = computed(() => new Set(props.validationErrors ?? []))

function handleCellUpdate(rowIndex: number, key: keyof T, value: any) {
  emit('cell:changed', rowIndex, key, value)
}

function isRowInvalid(index: number): boolean {
  return validationErrorSet.value.has(index)
}
</script>

<template>
  <div>
    <table class="w-full table-fixed mb-5">
      <TableHeaders :headers="headers" />
      <tbody>
        <TableRow
          v-for="(row, index) in visibleData"
          :key="(row as any).id ?? index"
          :row="row"
          :row-index="index"
          :columns="columns"
          :row-actions="rowActions"
          :mode="mode"
          :validation-error="isRowInvalid(index)"
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
