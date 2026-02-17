<script setup lang="ts">
import { computed, inject } from 'vue'
import { GenericTable, type ColumnConfig, type RowAction } from '../DesignSystem/Table'
import type { Income } from '@/types/income/income'
import { updateIncome as serviceUpdateIncome } from '@/service/income/updateIncome'
import { deleteIncome as serviceDeleteIncome } from '@/service/income/deleteIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowNotificationPopover from './hooks/RowNotificationPopover.vue'
import { useGetIncomes } from './hooks/useGetIncomes'

const { incomes, error, incomeDeleted } = useGetIncomes()
const popover = inject<PopoverRef>(POPOVER_SYMBOL)

// Handle cell updates
async function handleCellUpdate(rowIndex: number, key: keyof Income, value: any) {
  try {
    const income = incomes.value[rowIndex]

    // Check if value actually changed
    if (JSON.stringify(income[key]) === JSON.stringify(value)) {
      return
    }

    let updatedIncome = { ...income }

    // Handle date formatting
    if (key === 'date') {
      value = formatDate(new Date(value as string | Date).toISOString(), DateFormat.YYYY_MM_DD)
    }

    updatedIncome = { ...updatedIncome, [key]: value }

    // Update via service
    await serviceUpdateIncome(updatedIncome)

    // Update local state
    incomes.value[rowIndex] = updatedIncome

    // Show notification
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row updated' })

    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Handle row deletion
async function handleDelete(row: Income, index: number) {
  try {
    await serviceDeleteIncome(row.id)
    incomeDeleted(row)
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row deleted' })
    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Column configuration
const columns = computed<ColumnConfig<Income>[]>(() => [
  {
    key: 'date',
    label: 'Date',
    type: 'date',
  },
  {
    key: 'name',
    label: 'Name',
    type: 'longtext',
  },
  {
    key: 'amount',
    label: 'Amount ($)',
    type: 'number',
  },
])

// Row actions
const rowActions: RowAction<Income>[] = [
  {
    label: 'Delete',
    handler: handleDelete,
    buttonClass: 'delete-income-button',
  },
]
</script>

<template>
  <GenericTable
    :data="incomes"
    :columns="columns"
    :row-actions="rowActions"
    :error="error"
    mode="editable"
    @cell:changed="handleCellUpdate"
  />
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
