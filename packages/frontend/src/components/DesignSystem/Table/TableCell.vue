<script lang="ts" setup generic="T extends TableRowData">
import { computed, ref, watch } from 'vue'
import Input from '../Input.vue'
import DropdownWithInput from '@/components/DropdownWithInput/DropdownWithInput.vue'
import { useDebounce } from '@/helpers/hooks/useDebounce'
import type { ColumnConfig, TableRowData } from './types'

const ENTER_KEY = 'Enter'
const ESCAPE_KEY = 'Escape'
const LONGTEXT_IMMEDIATE_SAVE_SHIFT_KEY = true
const DEBOUNCE_DELAY_MS = 1000

type TableCellModelValue = string | number | undefined

const props = defineProps<{
  column: ColumnConfig<T>
  row: T
  rowIndex: number
  mode: 'editable' | 'view'
}>()

const emit = defineEmits<{
  'cell:changed': [key: keyof T, value: unknown]
  'local:update': [key: keyof T, value: unknown]
}>()

const columnKey = props.column.key

const cellValue = computed(() => {
  if (props.column.calculate) {
    return props.column.calculate(props.row)
  }

  return props.row[columnKey]
})

function toTableCellModelValue(value: unknown): TableCellModelValue {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (value === undefined || value === null) {
    return undefined
  }

  return String(value)
}

// Local value for immediate updates
const localValue = ref<TableCellModelValue>(toTableCellModelValue(cellValue.value))

// Watch for local value changes and emit immediately for recalculation
watch(localValue, (newValue, oldValue) => {
  if (Object.is(newValue, oldValue)) {
    return
  }

  emit('local:update', columnKey, newValue)
})

// Watch for external changes to row data
watch(cellValue, (newValue) => {
  const normalizedValue = toTableCellModelValue(newValue)

  if (Object.is(localValue.value, normalizedValue)) {
    return
  }

  localValue.value = normalizedValue
})

function getCellValue(): unknown {
  return cellValue.value
}

const formattedValue = computed(() => {
  const value = localValue.value
  if (props.column.format) {
    return props.column.format(value, props.row)
  }

  // Default formatting
  if (props.column.type === 'number' && value !== undefined && value !== null) {
    return typeof value === 'number' ? value.toFixed(2) : value
  }
  if (props.column.type === 'date' && value) {
    return value.toString()
  }
  return value ?? ''
})

const dropdownOptions = computed(() => {
  if (props.column.type !== 'dropdown') return []

  const options = props.column.dropdownOptions
  if (typeof options === 'function') {
    return options(props.row)
  }
  return options || []
})

const dropdownValue = computed<string | undefined>({
  get() {
    if (typeof localValue.value === 'string' || localValue.value === undefined) {
      return localValue.value
    }

    return String(localValue.value)
  },
  set(value) {
    localValue.value = value
  },
})

const isEditable = computed(() => {
  if (props.mode === 'view') return false
  if (props.column.calculate) return false // Calculated fields are never editable
  return props.column.editable !== false
})

// Debounced emit with 1 second delay
const debouncedEmit = useDebounce(() => {
  emitCellChanged()
}, DEBOUNCE_DELAY_MS)

function emitCellChanged() {
  emit('cell:changed', columnKey, localValue.value)
}

function blurEventTarget(event: KeyboardEvent) {
  ;(event.target as HTMLElement | null)?.blur()
}

function revertToOriginalValue(event: KeyboardEvent) {
  event.preventDefault()
  localValue.value = toTableCellModelValue(getCellValue())
  blurEventTarget(event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === ENTER_KEY) {
    event.preventDefault()
    emitCellChanged()
    blurEventTarget(event)
    return
  }

  if (event.key === ESCAPE_KEY) {
    revertToOriginalValue(event)
    return
  }

  debouncedEmit()
}

function handleLongtextKeydown(event: KeyboardEvent) {
  if (event.key === ENTER_KEY && event.shiftKey === LONGTEXT_IMMEDIATE_SAVE_SHIFT_KEY) {
    event.preventDefault()
    emitCellChanged()
    blurEventTarget(event)
    return
  }

  if (event.key === ENTER_KEY) {
    // Allow plain Enter to create new lines (don't prevent default)
    debouncedEmit()
    return
  }

  if (event.key === ESCAPE_KEY) {
    revertToOriginalValue(event)
    return
  }

  debouncedEmit()
}

function handleDropdownChange(value: string) {
  localValue.value = value
  emitCellChanged()
}

function handleDropdownEscape() {
  localValue.value = toTableCellModelValue(getCellValue())
}

function handleDateChange() {
  emitCellChanged()
}
</script>

<template>
  <td class="border p-1" :class="column.customClass">
    <!-- View mode or calculated/non-editable cells -->
    <p v-if="!isEditable" class="p-1">
      {{ formattedValue }}
    </p>

    <!-- Editable mode -->
    <template v-else>
      <!-- Text input -->
      <Input
        v-if="column.type === 'text' || !column.type"
        v-model="localValue"
        @keydown="handleKeydown"
      />

      <!-- Number input -->
      <Input
        v-else-if="column.type === 'number'"
        v-model="localValue"
        type="number"
        @keydown="handleKeydown"
      />

      <!-- Date input -->
      <Input
        v-else-if="column.type === 'date'"
        v-model="localValue"
        type="date"
        @change="handleDateChange"
      />

      <!-- Longtext input (textarea) -->
      <Input
        v-else-if="column.type === 'longtext'"
        v-model="localValue"
        variant="textarea"
        @keydown="handleLongtextKeydown"
      />

      <!-- Dropdown -->
      <DropdownWithInput
        v-else-if="column.type === 'dropdown'"
        v-model="dropdownValue"
        :dropdown-options="dropdownOptions"
        @on-change="handleDropdownChange"
        @escape-key-pressed="handleDropdownEscape"
      />
    </template>
  </td>
</template>
