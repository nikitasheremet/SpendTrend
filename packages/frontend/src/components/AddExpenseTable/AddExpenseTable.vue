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

type DisplayExpense = NewExpense

function toDisplayExpense(expense: NewExpense): DisplayExpense {
  const categoryId = getCategoryId(expense.category) || expense.category
  const categoryName = getCategoryName(categoryId) || expense.category
  const subCategoryName = getSubCategoryName(categoryId, expense.subCategory) || expense.subCategory

  return {
    ...expense,
    category: categoryName,
    subCategory: subCategoryName,
  }
}

function toDisplayExpenses(expenses: NewExpense[]): DisplayExpense[] {
  return expenses.map(toDisplayExpense)
}

function toModelExpense(expense: DisplayExpense): NewExpense {
  const categoryId = getCategoryId(expense.category) || expense.category
  const subCategoryId = getSubCategoryId(categoryId, expense.subCategory) || expense.subCategory

  return {
    ...expense,
    category: categoryId,
    subCategory: subCategoryId,
  }
}

function toModelExpenses(expenses: DisplayExpense[]): NewExpense[] {
  return expenses.map(toModelExpense)
}

// Create empty expense row
function createEmptyExpense(): NewExpense {
  return {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: undefined,
    category: '',
    subCategory: '',
  }
}

// Validation function
function validateExpenses(expenses: NewExpense[]): number[] {
  const errorIndexes: number[] = []
  expenses.forEach((expense, index) => {
    if (!expense.date || !expense.name || !expense.amount || !expense.category) {
      errorIndexes.push(index)
    }
  })
  return errorIndexes
}

// Save handler
async function handleSave(items: NewExpense[]): Promise<{ failedItems?: NewExpense[] }> {
  const { createdExpenses, failedExpenses } = await addNewExpense(toModelExpenses(items))
  if (createdExpenses.length > 0) {
    store.addExpenses(createdExpenses)
  }

  return {
    failedItems: failedExpenses.map((fe) => toDisplayExpense(fe.expenseInput)),
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
        Math.round(((expense.amount || 0) - (expense.paidBackAmount ?? 0)) * 100) / 100
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
    const preformattedExpenses = toDisplayExpenses(newData)
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
async function handleCellUpdate(rowIndex: number, key: keyof NewExpense, value: any) {
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
async function moveToIncome(row: NewExpense, index: number) {
  emit('moveToIncome', row)
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
const columns = computed<ColumnConfig<NewExpense>[]>(() => [
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
    calculate: (row: NewExpense) => {
      return Math.round(((row.amount || 0) - (row.paidBackAmount ?? 0)) * 100) / 100
    },
    format: (value: number) => value.toFixed(2),
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
    dropdownOptions: (row: NewExpense) => getSubcategories(getCategoryId(row.category)),
  },
])

// Row actions
const rowActions = computed<RowAction<NewExpense>[]>(() => [
  {
    label: 'Delete',
    handler: async (_row: NewExpense, index: number) => {
      await deleteRow(index)
    },
    show: () => tableData.value.length > 1,
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
    @cell:changed="handleCellUpdate"
  />
</template>

<style scoped></style>
