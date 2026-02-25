<script lang="ts" setup generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import TableCell from './TableCell.vue'
import Button from '../Button/Button.vue'
import type { ColumnConfig, RowAction } from './types'

const props = defineProps<{
  row: T
  rowIndex: number
  columns: ColumnConfig<T>[]
  rowActions?: RowAction<T>[]
  mode: 'editable' | 'view'
  validationError?: boolean
}>()

const emit = defineEmits<{
  'cell:changed': [rowIndex: number, key: keyof T, value: any]
}>()

// Track local edits for immediate recalculation
const localEdits = ref<Partial<T>>({})

watch(
  () => props.row,
  () => {
    localEdits.value = {}
  },
)

function applyLocalEdit(key: keyof T, value: any) {
  localEdits.value[key] = value
}

const visibleRowActions = computed(() => {
  if (!props.rowActions || props.rowActions.length === 0) {
    return []
  }

  return props.rowActions.filter((action) => {
    if (!action.show) return true
    return action.show(props.row, props.rowIndex)
  })
})

// Compute row with calculated fields and local edits
const computedRow = computed(() => {
  const mergedRow = { ...props.row, ...localEdits.value } as T

  for (const column of props.columns) {
    if (!column.calculate) {
      continue
    }

    mergedRow[column.key as keyof T] = column.calculate(mergedRow) as T[keyof T]
  }

  return mergedRow
})

function handleCellUpdate(key: keyof T, value: any) {
  applyLocalEdit(key, value)

  emit('cell:changed', props.rowIndex, key, value)
}

function handleLocalUpdate(key: keyof T, value: any) {
  applyLocalEdit(key, value)
}
</script>

<template>
  <tr
    class="hover:bg-gray-100/50"
    :class="{ 'bg-red-300/50 hover:bg-red-300/50': validationError }"
  >
    <!-- Render cells for each column -->
    <TableCell
      v-for="column in columns"
      :key="String(column.key)"
      :column="column"
      :row="computedRow"
      :row-index="rowIndex"
      :mode="mode"
      @cell:changed="handleCellUpdate"
      @local:update="handleLocalUpdate"
    />

    <!-- Render row actions -->
    <td
      v-for="(action, actionIndex) in visibleRowActions"
      :key="`action-${actionIndex}`"
      class="text-center p-1"
      :class="action.buttonClass"
    >
      <Button class="w-8/10 text-sm" @click="action.handler(row, rowIndex)">
        {{ action.label }}
      </Button>
    </td>
  </tr>
</template>
