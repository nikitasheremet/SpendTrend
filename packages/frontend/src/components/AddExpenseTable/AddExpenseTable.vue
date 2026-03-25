<script lang="ts" setup>
import { computed } from 'vue'
import {
  GenericTable,
  useTableOperations,
  type ColumnConfig,
  type RowAction,
  type TableAction,
} from '../DesignSystem/Table'
import { NewExpense } from '@/types/expenseData'
import { getStore } from '@/store/store'
import { addNewExpense } from '@/service/expenses/addNewExpense'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import { watch } from 'vue'

const newExpenses = defineModel<NewExpense[]>({ required: true })
const props = defineProps<{
  beforeSaveExpense?: () => Promise<boolean>
}>()
const store = getStore()

const emit = defineEmits<{
  moveToIncome: [expense: NewExpense]
}>()

// Category helper functions
const {
  categories,
  categoryNames,
  getCategoryName,
  getCategoryId,
  getSubCategoryName,
  getSubCategoryId,
  getSubcategories,
} = useCategoriesInExpenseData()

interface DisplayExpense extends NewExpense {
  rowKey: string
}

const ROW_KEY_PREFIX = 'expense-row'
const ROW_KEY_INCREMENT = 1
const ZERO_AMOUNT = 0
const ZERO_ITEMS_COUNT = 0
const NET_AMOUNT_SCALE = 100
const CURRENCY_DECIMALS = 2
const MINIMUM_ROWS_FOR_DELETE_ACTION = 1
let displayExpenseRowKeyCounter = ZERO_ITEMS_COUNT

function createDisplayExpenseRowKey(): string {
  displayExpenseRowKeyCounter += ROW_KEY_INCREMENT
  return `${ROW_KEY_PREFIX}-${displayExpenseRowKeyCounter}`
}

function toDisplayExpense(expense: NewExpense, rowKey?: string): DisplayExpense {
  const categoryId = getCategoryId(expense.category) || expense.category
  const categoryName = getCategoryName(categoryId) || expense.category
  const subCategoryName = getSubCategoryName(categoryId, expense.subCategory) || expense.subCategory

  return {
    ...expense,
    rowKey: rowKey ?? createDisplayExpenseRowKey(),
    category: categoryName,
    subCategory: subCategoryName,
  }
}

function toDisplayExpenses(
  expenses: NewExpense[],
  existingRows: DisplayExpense[] = [],
): DisplayExpense[] {
  return expenses.map((expense, index) => toDisplayExpense(expense, existingRows[index]?.rowKey))
}

function toModelExpense(expense: DisplayExpense): NewExpense {
  const { rowKey: _rowKey, ...modelExpense } = expense
  const categoryId = getCategoryId(expense.category) || expense.category
  const subCategoryId = getSubCategoryId(categoryId, expense.subCategory) || expense.subCategory

  return {
    ...modelExpense,
    category: categoryId,
    subCategory: subCategoryId,
  }
}

function toModelExpenses(expenses: DisplayExpense[]): NewExpense[] {
  return expenses.map(toModelExpense)
}

// Create empty expense row
function createEmptyExpense(): DisplayExpense {
  return {
    rowKey: createDisplayExpenseRowKey(),
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    netAmount: ZERO_AMOUNT,
    amount: ZERO_AMOUNT,
    paidBackAmount: undefined,
    category: '',
    subCategory: '',
  }
}

// Validation function
function validateExpenses(expenses: DisplayExpense[]): number[] {
  const errorIndexes: number[] = []
  expenses.forEach((expense, index) => {
    if (!expense.date || !expense.name || !expense.amount || !expense.category) {
      errorIndexes.push(index)
    }
  })
  return errorIndexes
}

// Save handler
async function handleSave(items: DisplayExpense[]): Promise<{ failedItems?: DisplayExpense[] }> {
  const { createdExpenses, failedExpenses } = await addNewExpense(toModelExpenses(items))
  if (createdExpenses.length > ZERO_ITEMS_COUNT) {
    store.addExpenses(createdExpenses)
  }

  return {
    failedItems: failedExpenses.map((fe) => toDisplayExpense(fe.expenseInput)),
  }
}

async function handleSaveExpenseAction(): Promise<void> {
  const shouldContinueSaving = (await props.beforeSaveExpense?.()) ?? true
  if (!shouldContinueSaving) {
    return
  }

  await saveAll()
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
} = useTableOperations<DisplayExpense>({
  initialData: toDisplayExpenses(newExpenses.value),
  mode: 'editable',
  createEmptyRow: createEmptyExpense,
  onSave: handleSave,
  validate: validateExpenses,
})

// Sync with model
let isSyncingFromModel = false

watch(
  tableData,
  (newData) => {
    // Recalculate net amounts
    newData.forEach((expense) => {
      expense.netAmount =
        Math.round(
          ((expense.amount || ZERO_AMOUNT) - (expense.paidBackAmount ?? ZERO_AMOUNT)) *
            NET_AMOUNT_SCALE,
        ) / NET_AMOUNT_SCALE
    })

    if (isSyncingFromModel) {
      return
    }

    newExpenses.value = toModelExpenses(newData)
  },
  { deep: true },
)

watch(
  [newExpenses, categories],
  ([newData]) => {
    const preformattedExpenses = toDisplayExpenses(newData, tableData.value)
    if (JSON.stringify(tableData.value) === JSON.stringify(preformattedExpenses)) {
      return
    }

    isSyncingFromModel = true
    tableData.value = preformattedExpenses
    isSyncingFromModel = false
  },
  { deep: true },
)

// Handle cell updates with category/subcategory transformation
async function handleCellUpdate(rowIndex: number, key: keyof DisplayExpense, value: unknown) {
  // Keep table display values as names; model IDs are handled by table-model sync
  if (key === 'category') {
    await updateCell(rowIndex, key, value)
    // Clear subcategory when category changes
    await updateCell(rowIndex, 'subCategory', '')
  } else if (key === 'subCategory') {
    await updateCell(rowIndex, key, value)
  } else {
    await updateCell(rowIndex, key, value)
  }
}

// Move to income handler
async function moveToIncome(row: DisplayExpense, index: number) {
  emit('moveToIncome', toModelExpense(row))
  await deleteRow(index)
}

// Clear all with confirmation
function handleClearAll() {
  if (confirm("Are you sure that you want to clear all expenses? This can't be undone")) {
    store.clearNewExpenses()
    clearAll()
  }
}

// Column configuration
const columns = computed<ColumnConfig<DisplayExpense>[]>(() => [
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
    customClass: 'w-1/4',
  },
  {
    key: 'amount',
    label: 'Amount ($)',
    type: 'number',
    required: true,
  },
  {
    key: 'paidBackAmount',
    label: 'Paid Back ($)',
    type: 'number',
    required: false,
  },
  {
    key: 'netAmount',
    label: 'Net Amount ($)',
    type: 'number',
    required: false,
    editable: false,
    calculate: (row: DisplayExpense) => {
      return (
        Math.round(
          ((row.amount || ZERO_AMOUNT) - (row.paidBackAmount ?? ZERO_AMOUNT)) * NET_AMOUNT_SCALE,
        ) / NET_AMOUNT_SCALE
      )
    },
    format: (value: unknown) => Number(value ?? ZERO_AMOUNT).toFixed(CURRENCY_DECIMALS),
  },
  {
    key: 'category',
    label: 'Category',
    type: 'dropdown',
    required: true,
    dropdownOptions: categoryNames.value,
  },
  {
    key: 'subCategory',
    label: 'Subcategory',
    type: 'dropdown',
    required: false,
    dropdownOptions: (row: DisplayExpense) => getSubcategories(getCategoryId(row.category)),
  },
])

// Row actions
const rowActions = computed<RowAction<DisplayExpense>[]>(() => [
  {
    label: 'Delete',
    handler: async (_row: DisplayExpense, index: number) => {
      await deleteRow(index)
    },
    show: () => tableData.value.length > MINIMUM_ROWS_FOR_DELETE_ACTION,
  },
  {
    label: '>> Income',
    handler: moveToIncome,
    buttonClass: 'text-nowrap',
  },
])

// Table actions
const tableActions: TableAction[] = [
  {
    label: 'Add New Expense Row',
    handler: () => addRow(),
  },
  {
    label: 'Clear All Expenses',
    handler: handleClearAll,
  },
  {
    label: 'Save Expense',
    handler: handleSaveExpenseAction,
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
