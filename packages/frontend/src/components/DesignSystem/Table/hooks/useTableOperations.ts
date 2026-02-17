import { ref, watch, onMounted, inject, type Ref } from 'vue'
import { useLoading } from '@/helpers/hooks/useLoading'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowDeletedPopover from '@/components/AddExpenseTable/hooks/RowDeletedPopover.vue'

const VALIDATION_ERROR_MESSAGE =
  'Validation errors in highlighted rows. Please fill in required fields'

interface SaveResult<T> {
  failedItems?: T[]
}

function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error('Unexpected error')
}

export interface TableOperationsOptions<T> {
  initialData?: T[]
  mode: 'editable' | 'view'
  createEmptyRow: () => T
  onSave?: (items: T[]) => Promise<SaveResult<T>>
  onUpdate?: (item: T, key: keyof T, value: any) => Promise<T>
  onDelete?: (item: T, index: number) => Promise<void>
  validate?: (items: T[]) => number[]
  idKey?: keyof T
  popoverComponent?: any
}

export interface TableOperationsReturn<T> {
  rows: Ref<T[]>
  addRow: (template?: Partial<T>) => void
  deleteRow: (index: number) => Promise<void>
  updateCell: (index: number, key: keyof T, value: any) => Promise<void>
  saveAll: () => Promise<void>
  validateRows: () => number[]
  clearAll: () => void
  isLoading: Ref<boolean>
  error: Ref<Error | undefined>
  validationErrors: Ref<number[]>
}

export function useTableOperations<T extends Record<string, any>>(
  options: TableOperationsOptions<T>,
): TableOperationsReturn<T> {
  const {
    initialData = [],
    mode,
    createEmptyRow,
    onSave,
    onUpdate,
    onDelete,
    validate,
    popoverComponent = RowDeletedPopover,
  } = options

  const popover = inject<PopoverRef>(POPOVER_SYMBOL)
  const rows = ref<T[]>(initialData) as Ref<T[]>
  const error = ref<Error | undefined>(undefined)
  const validationErrors = ref<number[]>([])
  const { loading: isLoading, startLoading, stopLoading } = useLoading()

  function ensureEditableHasAtLeastOneRow() {
    if (mode === 'editable' && rows.value.length === 0) {
      rows.value.push(createEmptyRow())
    }
  }

  function clearErrors() {
    error.value = undefined
  }

  // Initialize with at least one empty row if in editable mode
  onMounted(() => {
    ensureEditableHasAtLeastOneRow()
  })

  // Watch for empty arrays and auto-add row in editable mode
  watch(
    rows,
    () => {
      ensureEditableHasAtLeastOneRow()
    },
    { deep: true },
  )

  function addRow(template?: Partial<T>): void {
    const newRow = template ? { ...createEmptyRow(), ...template } : createEmptyRow()
    rows.value.push(newRow)
  }

  async function deleteRow(index: number): Promise<void> {
    try {
      const item = rows.value[index]

      // Call onDelete callback if provided (for items with IDs)
      if (onDelete) {
        await onDelete(item, index)
      }

      // Remove from array
      rows.value.splice(index, 1)

      // Show notification
      popover?.value?.showPopover(popoverComponent)

      clearErrors()
    } catch (err) {
      error.value = asError(err)
      console.error('useTableOperations.deleteRow failed', {
        index,
        error: error.value,
      })
      throw error.value
    }
  }

  async function updateCell(index: number, key: keyof T, value: any): Promise<void> {
    try {
      const item = rows.value[index]

      // Check if value actually changed
      if (JSON.stringify(item[key]) === JSON.stringify(value)) {
        return
      }

      // Call onUpdate callback if provided
      if (onUpdate) {
        const updatedItem = await onUpdate(item, key, value)
        rows.value[index] = updatedItem
      } else {
        // Direct update for editable mode
        rows.value[index] = { ...item, [key]: value }
      }

      clearErrors()
    } catch (err) {
      error.value = asError(err)
      console.error('useTableOperations.updateCell failed', {
        index,
        key,
        error: error.value,
      })
      throw error.value
    }
  }

  async function saveAll(): Promise<void> {
    if (!onSave) {
      throw new Error('onSave handler not provided')
    }

    startLoading()
    try {
      // Validate before saving
      if (validate) {
        validationErrors.value = validate(rows.value)
        if (validationErrors.value.length > 0) {
          throw new Error(VALIDATION_ERROR_MESSAGE)
        }
      }

      const result = await onSave(rows.value)

      // Handle partial failures
      if (result.failedItems && result.failedItems.length > 0) {
        rows.value = result.failedItems
      } else {
        // Success - reset to single empty row
        rows.value = [createEmptyRow()]
        validationErrors.value = []
      }

      clearErrors()
    } catch (err) {
      error.value = asError(err)
      console.error('useTableOperations.saveAll failed', {
        rowCount: rows.value.length,
        error: error.value,
      })
      throw error.value
    } finally {
      stopLoading()
    }
  }

  function validateRows(): number[] {
    if (!validate) return []
    validationErrors.value = validate(rows.value)
    return validationErrors.value
  }

  function clearAll(): void {
    rows.value = [createEmptyRow()]
    validationErrors.value = []
    error.value = undefined
  }

  return {
    rows,
    addRow,
    deleteRow,
    updateCell,
    saveAll,
    validateRows,
    clearAll,
    isLoading,
    error,
    validationErrors,
  }
}
