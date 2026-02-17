<script lang="ts" setup>
import { computed, watch } from 'vue'
import {
  GenericTable,
  useTableOperations,
  type ColumnConfig,
  type RowAction,
  type TableAction,
} from '../DesignSystem/Table'
import { NewIncome } from '@/types/income/income'
import { getStore } from '@/store/store'
import { addNewIncome } from '@/service/income/addNewIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'

const newIncomes = defineModel<NewIncome[]>({ required: true })
const store = getStore()

const emit = defineEmits<{
  moveToExpense: [income: NewIncome]
}>()

// Create empty income row
function createEmptyIncome(): NewIncome {
  return {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    amount: 0,
  }
}

// Validation function
function validateIncomes(incomes: NewIncome[]): number[] {
  const errorIndexes: number[] = []
  incomes.forEach((income, index) => {
    if (!income.name || !income.amount || !income.date) {
      errorIndexes.push(index)
    }
  })
  return errorIndexes
}

// Save handler
async function handleSave(items: NewIncome[]): Promise<{ failedItems?: NewIncome[] }> {
  const { failedIncomes } = await addNewIncome(items)
  return {
    failedItems: failedIncomes.map((fi) => fi.incomeInput),
  }
}

// Use table operations hook
const {
  rows: tableData,
  addRow,
  deleteRow,
  updateCell,
  saveAll,
  clearAll,
  isLoading,
  error,
  validationErrors,
} = useTableOperations<NewIncome>({
  initialData: newIncomes.value,
  mode: 'editable',
  createEmptyRow: createEmptyIncome,
  onSave: handleSave,
  validate: validateIncomes,
})

// Sync with model
watch(
  tableData,
  (newData) => {
    newIncomes.value = newData
  },
  { deep: true },
)

watch(
  newIncomes,
  (newData) => {
    if (tableData.value !== newData) {
      tableData.value = newData
    }
  },
  { deep: true },
)

// Move to expense handler
async function moveToExpense(row: NewIncome, index: number) {
  emit('moveToExpense', row)
  await deleteRow(index)
}

// Clear all with confirmation
function handleClearAll() {
  if (confirm("Are you sure that you want to clear all incomes? This can't be undone")) {
    store.clearNewIncomes()
    clearAll()
  }
}

// Column configuration
const columns = computed<ColumnConfig<NewIncome>[]>(() => [
  {
    key: 'date',
    label: 'Date',
    type: 'date',
    required: true,
  },
  {
    key: 'name',
    label: 'Name',
    type: 'longtext',
    required: true,
  },
  {
    key: 'amount',
    label: 'Amount ($)',
    type: 'number',
    required: true,
  },
])

// Row actions
const rowActions = computed<RowAction<NewIncome>[]>(() => [
  {
    label: 'Delete',
    handler: async (_row: NewIncome, index: number) => {
      await deleteRow(index)
    },
    show: () => tableData.value.length > 1,
  },
  {
    label: '>> Expense',
    handler: moveToExpense,
  },
])

// Table actions
const tableActions: TableAction[] = [
  {
    label: 'Add New Income Row',
    handler: () => addRow(),
  },
  {
    label: 'Clear All Income',
    handler: handleClearAll,
  },
  {
    label: 'Save Income',
    handler: saveAll,
  },
]
</script>

<template>
  <GenericTable
    :data="tableData"
    :columns="columns"
    :row-actions="rowActions"
    :table-actions="tableActions"
    :validation-errors="validationErrors"
    :error="error"
    :loading="isLoading"
    mode="editable"
    @cell:changed="updateCell"
  />
</template>

<style scoped></style>
