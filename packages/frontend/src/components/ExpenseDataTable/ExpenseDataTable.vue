<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { GenericTable, type ColumnConfig, type RowAction } from '../DesignSystem/Table'
import type { Expense } from '@/types/expenseData'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowNotificationPopover from './hooks/RowNotificationPopover.vue'
import { getStore } from '@/store/store'

type DisplayExpense = Omit<Expense, 'category' | 'subCategory'> & {
  category: string
  subCategory: string
}

const store = getStore()
const error = ref<Error | undefined>(undefined)
const popover = inject<PopoverRef>(POPOVER_SYMBOL)

// Category helpers
const { categoryNames, getCategory, getSubcategories } = useCategoriesInExpenseData()

// Preformat expenses to extract category and subCategory names for display
function preformatExpenses(rawExpenses: Expense[]): DisplayExpense[] {
  return rawExpenses.map((expense) => ({
    ...expense,
    category: expense.category?.name || '',
    subCategory: expense.subCategory?.name || '',
  })) as DisplayExpense[]
}

function getCurrentDisplayValue(expense: Expense, key: keyof DisplayExpense) {
  if (key === 'category') {
    return expense.category?.name || ''
  }

  if (key === 'subCategory') {
    return expense.subCategory?.name || ''
  }

  return expense[key]
}

const expenses = computed(() => preformatExpenses(store.expenses.value))

// Handle cell updates
async function handleCellUpdate(rowIndex: number, key: keyof DisplayExpense, value: unknown) {
  try {
    const expense = store.expenses.value[rowIndex]

    // Check if value actually changed
    const currentDisplayValue = getCurrentDisplayValue(expense, key)
    if (JSON.stringify(currentDisplayValue) === JSON.stringify(value)) {
      return
    }

    let updatedExpense: Expense = { ...expense }

    // Handle special cases
    if (key === 'date') {
      updatedExpense.date = formatDate(
        new Date(value as string | Date).toISOString(),
        DateFormat.YYYY_MM_DD,
      )
    } else if (key === 'category') {
      // Value is category name string, need to get full category object for service
      const category = getCategory(value as string)
      updatedExpense.category = category
      // Clear subcategory when category changes
      updatedExpense.subCategory = undefined
    } else if (key === 'subCategory') {
      // Value is subcategory name string, need to find subcategory object for service
      const categoryObj = updatedExpense.category
      const subcategory = categoryObj.subCategories?.find((sub) => sub.name === value)
      if (subcategory) {
        updatedExpense.subCategory = subcategory
      } else {
        updatedExpense.subCategory = undefined
      }
    } else {
      updatedExpense = {
        ...updatedExpense,
        [key]: value,
      }
    }

    // Update via service
    const updatedFromService = await serviceUpdateExpense(updatedExpense)
    store.updateExpense(updatedFromService)

    // Show notification
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row updated' })

    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Handle row deletion
async function handleDelete(row: DisplayExpense) {
  try {
    await serviceDeleteExpense(row.id)
    store.deleteExpense(row.id)
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row deleted' })
    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Column configuration
const columns = computed<ColumnConfig<DisplayExpense>[]>(() => [
  {
    key: 'date',
    label: 'Date',
    type: 'date',
    customClass: 'w-1/7',
  },
  {
    key: 'name',
    label: 'Name',
    type: 'longtext',
    customClass: 'w-1/4',
  },
  {
    key: 'amount',
    label: 'Amount ($)',
    type: 'number',
  },
  {
    key: 'paidBackAmount',
    label: 'Paid Back ($)',
    type: 'number',
  },
  {
    key: 'netAmount',
    label: 'Net Amount ($)',
    type: 'number',
    editable: false,
    calculate: (row: DisplayExpense) => (row.amount || 0) - (row.paidBackAmount || 0),
    format: (value: unknown) => {
      if (typeof value === 'number') {
        return value.toFixed(2)
      }

      return Number(value ?? 0).toFixed(2)
    },
  },
  {
    key: 'category',
    label: 'Category',
    type: 'dropdown',
    dropdownOptions: categoryNames.value,
  },
  {
    key: 'subCategory',
    label: 'Subcategory',
    type: 'dropdown',
    dropdownOptions: (row: DisplayExpense) => {
      const category = getCategory(row.category)
      return getSubcategories(category?.id)
    },
  },
])

// Row actions
const rowActions: RowAction<DisplayExpense>[] = [
  {
    label: 'Delete',
    handler: handleDelete,
    buttonClass: 'delete-expense-button',
  },
]
</script>

<template>
  <GenericTable
    :data="expenses"
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
