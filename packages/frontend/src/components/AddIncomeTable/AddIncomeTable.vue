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

interface DisplayIncome extends NewIncome {
  rowKey: string
}

const ROW_KEY_PREFIX = 'income-row'
const ROW_KEY_INCREMENT = 1
const ZERO_AMOUNT = 0
const ZERO_ITEMS_COUNT = 0
const MINIMUM_ROWS_FOR_DELETE_ACTION = 1
let displayIncomeRowKeyCounter = ZERO_ITEMS_COUNT

function createDisplayIncomeRowKey(): string {
  displayIncomeRowKeyCounter += ROW_KEY_INCREMENT
  return `${ROW_KEY_PREFIX}-${displayIncomeRowKeyCounter}`
}

function toDisplayIncome(income: NewIncome, rowKey?: string): DisplayIncome {
  return {
    ...income,
    rowKey: rowKey ?? createDisplayIncomeRowKey(),
  }
}

function toDisplayIncomes(
  incomes: NewIncome[],
  existingRows: DisplayIncome[] = [],
): DisplayIncome[] {
  return incomes.map((income, index) => toDisplayIncome(income, existingRows[index]?.rowKey))
}

function toModelIncome(income: DisplayIncome): NewIncome {
  const { rowKey: _rowKey, ...modelIncome } = income
  return modelIncome
}

function toModelIncomes(incomes: DisplayIncome[]): NewIncome[] {
  return incomes.map(toModelIncome)
}

// Create empty income row
function createEmptyIncome(): DisplayIncome {
  return {
    rowKey: createDisplayIncomeRowKey(),
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    amount: ZERO_AMOUNT,
  }
}

// Validation function
function validateIncomes(incomes: DisplayIncome[]): number[] {
  const errorIndexes: number[] = []
  incomes.forEach((income, index) => {
    if (!income.name || !income.amount || !income.date) {
      errorIndexes.push(index)
    }
  })
  return errorIndexes
}

// Save handler
async function handleSave(items: DisplayIncome[]): Promise<{ failedItems?: DisplayIncome[] }> {
  const { createdIncomes, failedIncomes } = await addNewIncome(toModelIncomes(items))
  if (createdIncomes.length > ZERO_ITEMS_COUNT) {
    store.addIncomes(createdIncomes)
  }

  return {
    failedItems: failedIncomes.map((fi) => toDisplayIncome(fi.incomeInput)),
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
} = useTableOperations<DisplayIncome>({
  initialData: toDisplayIncomes(newIncomes.value),
  mode: 'editable',
  createEmptyRow: createEmptyIncome,
  onSave: handleSave,
  validate: validateIncomes,
})

// Sync with model
watch(
  tableData,
  (newData) => {
    newIncomes.value = toModelIncomes(newData)
  },
  { deep: true },
)

watch(
  newIncomes,
  (newData) => {
    const displayIncomes = toDisplayIncomes(newData, tableData.value)
    if (JSON.stringify(tableData.value) !== JSON.stringify(displayIncomes)) {
      tableData.value = displayIncomes
    }
  },
  { deep: true },
)

async function handleCellUpdate(rowIndex: number, key: keyof DisplayIncome, value: unknown) {
  await updateCell(rowIndex, key, value)
}

// Move to expense handler
async function moveToExpense(row: DisplayIncome, index: number) {
  emit('moveToExpense', toModelIncome(row))
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
const columns = computed<ColumnConfig<DisplayIncome>[]>(() => [
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
const rowActions = computed<RowAction<DisplayIncome>[]>(() => [
  {
    label: 'Delete',
    handler: async (_row: DisplayIncome, index: number) => {
      await deleteRow(index)
    },
    show: () => tableData.value.length > MINIMUM_ROWS_FOR_DELETE_ACTION,
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
    row-key="rowKey"
    :columns="columns"
    :row-actions="rowActions"
    :table-actions="tableActions"
    :validation-errors="validationErrors"
    :error="error"
    :loading="isLoading"
    mode="editable"
    @cell:changed="handleCellUpdate"
  />
</template>

<style scoped></style>
