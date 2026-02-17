<script setup lang="ts">
import { computed, onMounted, ref, inject } from 'vue'
import { GenericTable, type ColumnConfig, type RowAction } from '../DesignSystem/Table'
import type { Expense } from '@/types/expenseData'
import { getExpenses } from '@/service/expenses/getExpenses'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowNotificationPopover from './hooks/RowNotificationPopover.vue'

const expenses = ref<any[]>([])
const error = ref<Error | undefined>(undefined)
const popover = inject<PopoverRef>(POPOVER_SYMBOL)

// Category helpers
const { categoryNames, getCategory, getSubcategories } = useCategoriesInExpenseData()

// Preformat expenses to extract category and subCategory names for display
function preformatExpenses(
  rawExpenses: Expense[],
): Array<Omit<Expense, 'category' | 'subCategory'> & { category: string; subCategory: string }> {
  return rawExpenses.map((expense) => ({
    ...expense,
    category: expense.category?.name || '',
    subCategory: expense.subCategory?.name || '',
  })) as unknown as Array<
    Omit<Expense, 'category' | 'subCategory'> & { category: string; subCategory: string }
  >
}

// Fetch expenses on mount
onMounted(async () => {
  try {
    const rawExpenses = await getExpenses()
    expenses.value = preformatExpenses(rawExpenses)
  } catch (err) {
    error.value = err as Error
  }
})

// Handle cell updates
async function handleCellUpdate(rowIndex: number, key: string | number | symbol, value: any) {
  try {
    const expense = expenses.value[rowIndex]

    // Check if value actually changed
    if (JSON.stringify(expense[key]) === JSON.stringify(value)) {
      return
    }

    let updatedExpense: any = { ...expense }

    // Handle special cases
    if (key === 'date') {
      value = formatDate(new Date(value as string | Date).toISOString(), DateFormat.YYYY_MM_DD)
      updatedExpense[key] = value
    } else if (key === 'category') {
      // Value is category name string, need to get full category object for service
      const category = getCategory(value as string)
      updatedExpense.category = category
      // Clear subcategory when category changes
      updatedExpense.subCategory = ''
    } else if (key === 'subCategory') {
      // Value is subcategory name string, need to find subcategory object for service
      const categoryName =
        typeof updatedExpense.category === 'string'
          ? updatedExpense.category
          : updatedExpense.category?.name
      const categoryObj = getCategory(categoryName)
      const subcategory = categoryObj.subCategories?.find((sub) => sub.name === value)
      if (subcategory) {
        updatedExpense.subCategory = subcategory
      }
    } else {
      updatedExpense = { ...updatedExpense, [key]: value }
    }

    // Prepare for service (convert category/subCategory back to objects)
    const servicePayload: Expense = {
      ...updatedExpense,
      category:
        typeof updatedExpense.category === 'string'
          ? getCategory(updatedExpense.category)
          : updatedExpense.category,
      subCategory:
        typeof updatedExpense.subCategory === 'string' ? undefined : updatedExpense.subCategory,
    }

    // Update via service
    await serviceUpdateExpense(servicePayload)

    // Update local state with names for display
    const displayCategory =
      typeof updatedExpense.category === 'string'
        ? updatedExpense.category
        : updatedExpense.category?.name

    // If category changed, ensure subcategory is cleared
    const displaySubCategory =
      key === 'category'
        ? ''
        : typeof updatedExpense.subCategory === 'string'
          ? updatedExpense.subCategory
          : updatedExpense.subCategory?.name || ''

    expenses.value[rowIndex] = {
      ...updatedExpense,
      category: displayCategory,
      subCategory: displaySubCategory,
    }

    // Show notification
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row updated' })

    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Handle row deletion
async function handleDelete(row: Expense, index: number) {
  try {
    await serviceDeleteExpense(row.id)
    expenses.value.splice(index, 1)
    popover?.value?.showPopover(RowNotificationPopover, { message: 'Row deleted' })
    error.value = undefined
  } catch (err) {
    error.value = err as Error
  }
}

// Column configuration
const columns = computed<ColumnConfig<any>[]>(() => [
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
    calculate: (row) => (row.amount || 0) - (row.paidBackAmount || 0),
    format: (value: number) => value.toFixed(2),
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
    dropdownOptions: (row: Expense) => {
      const categoryName =
        typeof row.category === 'string' ? row.category : (row.category as any)?.name
      return getSubcategories(getCategory(categoryName).id)
    },
  },
])

// Row actions
const rowActions: RowAction<any>[] = [
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
