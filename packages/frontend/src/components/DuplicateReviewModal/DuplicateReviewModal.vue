<script setup lang="ts">
import { GenericTable, type ColumnConfig, type RowAction } from '@/components/DesignSystem/Table'
import Modal from '@/components/DesignSystem/Modal/Modal.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import {
  DUPLICATE_SOURCE_EXISTING,
  DUPLICATE_SOURCE_NEW,
  type ExpenseDuplicateEntry,
  type IncomeDuplicateEntry,
} from '@/store/storeDuplicateTypes'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import { computed } from 'vue'

const EXPENSE_TAB = 'expense'
const ZERO_COUNT = 0
const MISSING_VALUE_FALLBACK = '-'

interface ExpenseDuplicateTableRow {
  rowKey: string
  draftIndex: number
  date: string
  name: string
  amount: string
  category: string
  subCategory: string
  duplicateCountInNew: number
  duplicateCountInExisting: number
}

interface IncomeDuplicateTableRow {
  rowKey: string
  draftIndex: number
  date: string
  name: string
  amount: string
  duplicateCountInNew: number
  duplicateCountInExisting: number
}

const modalTitle = 'Duplicate review'
const closeText = 'Close'
const removeDraftRowLabel = 'Remove draft row'
const expenseEmptyState = 'No duplicate expenses found.'
const incomeEmptyState = 'No duplicate incomes found.'
const duplicatesInNewColumnLabel = 'Duplicates (new)'
const duplicatesInExistingColumnLabel = 'Duplicates (existing)'
const duplicateCountColumnClass = 'w-24 text-center'
const cancelSaveButtonLabel = 'Cancel save'
const saveDataButtonLabel = 'Save data'
const saveDataWithDuplicatesButtonLabel = 'Save data with duplicates'

const { getCategoryName, getCategoryId, getSubCategoryName } = useCategoriesInExpenseData()

const props = withDefaults(
  defineProps<{
    isModalOpen: boolean
    expenseDuplicates: ExpenseDuplicateEntry[]
    incomeDuplicates: IncomeDuplicateEntry[]
    visibleDataTab: typeof EXPENSE_TAB | 'income'
    showSaveReviewActions?: boolean
    showCloseButton?: boolean
  }>(),
  {
    showSaveReviewActions: false,
    showCloseButton: true,
  },
)

const emit = defineEmits<{
  modalClosed: []
  cancelSaveRequested: []
  saveRequested: []
  expenseDraftRowRemovalRequested: [draftIndex: number]
  incomeDraftRowRemovalRequested: [draftIndex: number]
}>()

const isExpenseScope = computed(() => props.visibleDataTab === EXPENSE_TAB)
const saveButtonLabel = computed(() => {
  if (isExpenseScope.value) {
    return props.expenseDuplicates.length > ZERO_COUNT
      ? saveDataWithDuplicatesButtonLabel
      : saveDataButtonLabel
  }

  return props.incomeDuplicates.length > ZERO_COUNT
    ? saveDataWithDuplicatesButtonLabel
    : saveDataButtonLabel
})

function formatOptionalText(value?: string): string {
  return value || MISSING_VALUE_FALLBACK
}

function formatOptionalAmount(value?: number): string {
  if (typeof value !== 'number') {
    return MISSING_VALUE_FALLBACK
  }

  return value.toString()
}

function toReadableCategoryName(rawCategoryValue?: string): string {
  const categoryId = getCategoryId(rawCategoryValue) || rawCategoryValue
  return getCategoryName(categoryId) || formatOptionalText(rawCategoryValue)
}

function toReadableSubCategoryName(
  rawCategoryValue?: string,
  rawSubCategoryValue?: string,
): string {
  const categoryId = getCategoryId(rawCategoryValue) || rawCategoryValue
  return (
    getSubCategoryName(categoryId, rawSubCategoryValue) || formatOptionalText(rawSubCategoryValue)
  )
}

const expenseColumns: ColumnConfig<ExpenseDuplicateTableRow>[] = [
  {
    key: 'date',
    label: 'Date',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'amount',
    label: 'Amount ($)',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'subCategory',
    label: 'SubCategory',
  },
  {
    key: 'duplicateCountInNew',
    label: duplicatesInNewColumnLabel,
    customClass: duplicateCountColumnClass,
  },
  {
    key: 'duplicateCountInExisting',
    label: duplicatesInExistingColumnLabel,
    customClass: duplicateCountColumnClass,
  },
]

const incomeColumns: ColumnConfig<IncomeDuplicateTableRow>[] = [
  {
    key: 'date',
    label: 'Date',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'amount',
    label: 'Amount ($)',
  },
  {
    key: 'duplicateCountInNew',
    label: duplicatesInNewColumnLabel,
    customClass: duplicateCountColumnClass,
  },
  {
    key: 'duplicateCountInExisting',
    label: duplicatesInExistingColumnLabel,
    customClass: duplicateCountColumnClass,
  },
]

const expenseTableRows = computed<ExpenseDuplicateTableRow[]>(() =>
  props.expenseDuplicates.map((expenseDuplicate) => ({
    rowKey: `${expenseDuplicate.duplicateKey}-${expenseDuplicate.draftIndex}`,
    draftIndex: expenseDuplicate.draftIndex,
    date: formatOptionalText(expenseDuplicate.draftRow.date),
    name: formatOptionalText(expenseDuplicate.draftRow.name),
    amount: formatOptionalAmount(expenseDuplicate.draftRow.amount),
    category: toReadableCategoryName(expenseDuplicate.draftRow.category),
    subCategory: toReadableSubCategoryName(
      expenseDuplicate.draftRow.category,
      expenseDuplicate.draftRow.subCategory,
    ),
    duplicateCountInNew: expenseDuplicate.matches.filter(
      (match) => match.source === DUPLICATE_SOURCE_NEW,
    ).length,
    duplicateCountInExisting: expenseDuplicate.matches.filter(
      (match) => match.source === DUPLICATE_SOURCE_EXISTING,
    ).length,
  })),
)

const incomeTableRows = computed<IncomeDuplicateTableRow[]>(() =>
  props.incomeDuplicates.map((incomeDuplicate) => ({
    rowKey: `${incomeDuplicate.duplicateKey}-${incomeDuplicate.draftIndex}`,
    draftIndex: incomeDuplicate.draftIndex,
    date: formatOptionalText(incomeDuplicate.draftRow.date),
    name: formatOptionalText(incomeDuplicate.draftRow.name),
    amount: formatOptionalAmount(incomeDuplicate.draftRow.amount),
    duplicateCountInNew: incomeDuplicate.matches.filter(
      (match) => match.source === DUPLICATE_SOURCE_NEW,
    ).length,
    duplicateCountInExisting: incomeDuplicate.matches.filter(
      (match) => match.source === DUPLICATE_SOURCE_EXISTING,
    ).length,
  })),
)

const expenseRowActions: RowAction<ExpenseDuplicateTableRow>[] = [
  {
    label: removeDraftRowLabel,
    handler: (row) => requestExpenseDraftRowRemoval(row.draftIndex),
  },
]

const incomeRowActions: RowAction<IncomeDuplicateTableRow>[] = [
  {
    label: removeDraftRowLabel,
    handler: (row) => requestIncomeDraftRowRemoval(row.draftIndex),
  },
]

function requestExpenseDraftRowRemoval(draftIndex: number) {
  emit('expenseDraftRowRemovalRequested', draftIndex)
}

function requestIncomeDraftRowRemoval(draftIndex: number) {
  emit('incomeDraftRowRemovalRequested', draftIndex)
}
</script>

<template>
  <Modal
    :is-modal-open="isModalOpen"
    class="w-9/10 max-w-5xl"
    :close-text="closeText"
    :show-close-button="showCloseButton"
    @modal-closed="emit('modalClosed')"
  >
    <h2 class="text-xl font-semibold mb-4">{{ modalTitle }}</h2>

    <div v-if="isExpenseScope" class="space-y-3">
      <p v-if="expenseTableRows.length === ZERO_COUNT" data-testid="expense-duplicates-empty-state">
        {{ expenseEmptyState }}
      </p>

      <GenericTable
        v-else
        :data="expenseTableRows"
        :columns="expenseColumns"
        :row-actions="expenseRowActions"
        mode="view"
        row-key="rowKey"
        :progressive-render="false"
      />
    </div>

    <div v-if="!isExpenseScope" class="space-y-3">
      <p v-if="incomeTableRows.length === ZERO_COUNT" data-testid="income-duplicates-empty-state">
        {{ incomeEmptyState }}
      </p>

      <GenericTable
        v-else
        :data="incomeTableRows"
        :columns="incomeColumns"
        :row-actions="incomeRowActions"
        mode="view"
        row-key="rowKey"
        :progressive-render="false"
      />
    </div>

    <div v-if="props.showSaveReviewActions" class="flex justify-end gap-3 mt-4">
      <Button type="secondary" @click="emit('cancelSaveRequested')">{{
        cancelSaveButtonLabel
      }}</Button>
      <Button type="primary" @click="emit('saveRequested')">{{ saveButtonLabel }}</Button>
    </div>
  </Modal>
</template>
