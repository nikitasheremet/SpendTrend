<script setup lang="ts">
import AddExpenseTable from '@/components/AddExpenseTable/AddExpenseTable.vue'
import AddIncomeTable from '@/components/AddIncomeTable/AddIncomeTable.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import TabViewNav from '@/components/DesignSystem/TabViewNav/TabViewNav.vue'
import DuplicateReviewModal from '@/components/DuplicateReviewModal/DuplicateReviewModal.vue'
import { NewExpense } from '@/types/expenseData'
import { NewIncome } from '@/types/income/income'
import { computed, ref } from 'vue'
import { getStore } from '@/store/store'
import { formatPastedBankData } from '@/helpers/bankInfoFormatting/formatPastedBankData'
import { DataType } from '@/helpers/bankInfoFormatting/bankInfoTypes'
import { useControlModal } from '@/components/DesignSystem/Modal/useControlModal'

const TAB_EXPENSE = 'expense'
const TAB_INCOME = 'income'
const FIRST_DRAFT_INDEX = 0
const NO_EXPENSE_DUPLICATES = 0
const NO_INCOME_DUPLICATES = 0
const ZERO_AMOUNT = 0

const addDataTabs = [
  { label: 'Expenses', value: TAB_EXPENSE },
  { label: 'Income', value: TAB_INCOME },
]

const duplicatesButtonLabel = 'Duplicates'
const formatDataPlaceholder = 'Paste your bank data here. Copy it directly from your bank website'

const store = getStore()
const currentTab = ref<typeof TAB_EXPENSE | typeof TAB_INCOME>(TAB_EXPENSE)
const {
  isModalOpen: isDuplicatesModalOpen,
  openModal: openDuplicatesModal,
  closeModal: closeDuplicatesModal,
} = useControlModal()
const duplicateModalVisibleDataTab = ref<typeof TAB_EXPENSE | typeof TAB_INCOME>(TAB_EXPENSE)
const isExpenseSaveReviewPending = ref(false)
const isIncomeSaveReviewPending = ref(false)

const isSaveReviewPending = computed(
  () => isExpenseSaveReviewPending.value || isIncomeSaveReviewPending.value,
)

function hasMeaningfulExpenseDraftRow(): boolean {
  return store.newExpenses.value.some((expense) => {
    return (
      Boolean(expense.name?.trim()) ||
      Boolean(expense.category?.trim()) ||
      Boolean(expense.subCategory?.trim()) ||
      expense.amount > ZERO_AMOUNT ||
      (expense.paidBackAmount ?? ZERO_AMOUNT) > ZERO_AMOUNT ||
      expense.netAmount > ZERO_AMOUNT
    )
  })
}

function hasMeaningfulIncomeDraftRow(): boolean {
  return store.newIncomes.value.some((income) => {
    return Boolean(income.name?.trim()) || (income.amount ?? ZERO_AMOUNT) > ZERO_AMOUNT
  })
}

const hasDraftRowsInDuplicateModalScope = computed(() => {
  if (duplicateModalVisibleDataTab.value === TAB_EXPENSE) {
    return hasMeaningfulExpenseDraftRow()
  }

  return hasMeaningfulIncomeDraftRow()
})

const isSaveReviewActionsVisible = computed(
  () => isSaveReviewPending.value && hasDraftRowsInDuplicateModalScope.value,
)

const isDuplicatesPresentInCurrentTab = computed(() => {
  if (currentTab.value === TAB_EXPENSE) {
    return store.isExpenseDuplicatesPresent.value
  }

  return store.isIncomeDuplicatesPresent.value
})

let pendingExpenseSavePromise: Promise<boolean> | null = null
let resolvePendingExpenseSave: ((shouldContinueSaving: boolean) => void) | null = null
let pendingIncomeSavePromise: Promise<boolean> | null = null
let resolvePendingIncomeSave: ((shouldContinueSaving: boolean) => void) | null = null

function formatData(dataToFormat: string) {
  const createdData = formatPastedBankData(dataToFormat)
  console.log('Created data:', createdData)
  const newExpensesToAdd = createdData
    .filter((data) => data.type === DataType.EXPENSE)
    .map((data) => ({
      date: data.date,
      name: data.name,
      amount: Math.abs(data.amount),
      netAmount: Math.abs(data.amount),
      paidBackAmount: 0,
      category: '',
      subCategory: '',
    }))
  newExpensesToAdd.forEach((expense) => store.addNewExpense(expense))

  const newIncomesToAdd = createdData
    .filter((data) => data.type === DataType.INCOME)
    .map((data) => ({
      date: data.date,
      name: data.name,
      amount: Math.abs(data.amount),
    }))
  newIncomesToAdd.forEach((income) => store.addNewIncome(income))
}

function moveToIncome(expense: NewExpense) {
  store.addNewIncome({
    date: expense.date,
    name: expense.name,
    amount: expense.amount,
  })
}

function moveToExpense(income: NewIncome) {
  store.addNewExpense({
    date: income.date || '',
    name: income.name || '',
    amount: income.amount || 0,
    netAmount: income.amount || 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  })
}

function handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData
  if (clipboardData) {
    formatData(clipboardData.getData('text/html'))
  }
}

function handleMainTabClick(tabValue: string) {
  if (tabValue !== TAB_EXPENSE && tabValue !== TAB_INCOME) {
    return
  }

  currentTab.value = tabValue
}

function openDuplicatesReviewModal() {
  if (!isDuplicatesPresentInCurrentTab.value) {
    return
  }

  isExpenseSaveReviewPending.value = false
  isIncomeSaveReviewPending.value = false
  duplicateModalVisibleDataTab.value = currentTab.value
  openDuplicatesModal()
}

function resolvePendingSaveDecision(shouldContinueSaving: boolean) {
  if (resolvePendingExpenseSave) {
    resolvePendingExpenseSave(shouldContinueSaving)
    resolvePendingExpenseSave = null
    pendingExpenseSavePromise = null
    isExpenseSaveReviewPending.value = false
  }

  if (resolvePendingIncomeSave) {
    resolvePendingIncomeSave(shouldContinueSaving)
    resolvePendingIncomeSave = null
    pendingIncomeSavePromise = null
    isIncomeSaveReviewPending.value = false
  }
}

function closeDuplicatesReviewModal() {
  closeDuplicatesModal()

  if (isSaveReviewPending.value && !hasDraftRowsInDuplicateModalScope.value) {
    resolvePendingSaveDecision(false)
    return
  }

  resolvePendingSaveDecision(true)
}

function cancelExpenseSaveFromReviewModal() {
  closeDuplicatesModal()
  resolvePendingSaveDecision(false)
}

function continuePendingSaveFromReviewModal() {
  closeDuplicatesModal()
  resolvePendingSaveDecision(true)
}

async function beforeSaveExpense() {
  if (store.expenseDuplicates.value.length === NO_EXPENSE_DUPLICATES) {
    return true
  }

  if (pendingExpenseSavePromise) {
    return pendingExpenseSavePromise
  }

  isExpenseSaveReviewPending.value = true
  duplicateModalVisibleDataTab.value = TAB_EXPENSE
  openDuplicatesModal()

  pendingExpenseSavePromise = new Promise<boolean>((resolve) => {
    resolvePendingExpenseSave = resolve
  })

  return pendingExpenseSavePromise
}

async function beforeSaveIncome() {
  if (store.incomeDuplicates.value.length === NO_INCOME_DUPLICATES) {
    return true
  }

  if (pendingIncomeSavePromise) {
    return pendingIncomeSavePromise
  }

  isIncomeSaveReviewPending.value = true
  duplicateModalVisibleDataTab.value = TAB_INCOME
  openDuplicatesModal()

  pendingIncomeSavePromise = new Promise<boolean>((resolve) => {
    resolvePendingIncomeSave = resolve
  })

  return pendingIncomeSavePromise
}

function isValidDraftIndex<T>(rows: T[], draftIndex: number): boolean {
  return draftIndex >= FIRST_DRAFT_INDEX && draftIndex < rows.length
}

function removeExpenseDuplicateDraftRow(draftIndex: number) {
  if (!isValidDraftIndex(store.newExpenses.value, draftIndex)) {
    return
  }

  store.newExpenses.value.splice(draftIndex, 1)
}

function removeIncomeDuplicateDraftRow(draftIndex: number) {
  if (!isValidDraftIndex(store.newIncomes.value, draftIndex)) {
    return
  }

  store.newIncomes.value.splice(draftIndex, 1)
}
</script>

<template>
  <div class="flex items-center gap-7 mb-5">
    <textarea
      :placeholder="formatDataPlaceholder"
      class="border border-gray-300 rounded-md p-2 w-1/2 resize-none"
      readonly
      @paste.prevent="handlePaste"
    />
  </div>
  <div class="flex items-start justify-between">
    <TabViewNav :tabs="addDataTabs" :current-tab="currentTab" @tab-clicked="handleMainTabClick" />
    <Button
      type="primary"
      class-to-add="disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!isDuplicatesPresentInCurrentTab"
      :show-indicator="isDuplicatesPresentInCurrentTab"
      @click="openDuplicatesReviewModal"
    >
      {{ duplicatesButtonLabel }}
    </Button>
  </div>
  <div v-if="currentTab === TAB_EXPENSE">
    <AddExpenseTable
      v-model="store.newExpenses.value"
      :before-save-expense="beforeSaveExpense"
      @move-to-income="moveToIncome"
    />
  </div>
  <div v-if="currentTab === TAB_INCOME">
    <AddIncomeTable
      v-model="store.newIncomes.value"
      :before-save-income="beforeSaveIncome"
      @move-to-expense="moveToExpense"
    />
  </div>

  <DuplicateReviewModal
    :is-modal-open="isDuplicatesModalOpen"
    :expense-duplicates="store.expenseDuplicates.value"
    :income-duplicates="store.incomeDuplicates.value"
    :visible-data-tab="duplicateModalVisibleDataTab"
    :show-close-button="!isSaveReviewActionsVisible"
    :show-save-review-actions="isSaveReviewActionsVisible"
    @modal-closed="closeDuplicatesReviewModal"
    @cancel-save-requested="cancelExpenseSaveFromReviewModal"
    @save-requested="continuePendingSaveFromReviewModal"
    @expense-draft-row-removal-requested="removeExpenseDuplicateDraftRow"
    @income-draft-row-removal-requested="removeIncomeDuplicateDraftRow"
  />
</template>

<style>
.is-active {
  background-color: darkgrey;
}
</style>
