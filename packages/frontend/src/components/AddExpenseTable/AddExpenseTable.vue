<script lang="ts" setup>
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'
import { NewExpense } from '@/types/expenseData'
import Button from '../DesignSystem/Button/Button.vue'
import TableHeaders from '../TableHeaders.vue'
import LoadingModal from '../DesignSystem/Modal/LoadingModal.vue'
import { getStore } from '@/store/store'

const newExpenses = defineModel<NewExpense[]>({ required: true })

const store = getStore()

const emit = defineEmits<{
  moveToIncome: [expense: NewExpense]
}>()

const {
  newExpenseData,
  addExpense,
  addNewExpenseRow,
  deleteNewExpenseRow,
  error,
  validationErrorsIndexes,
  loading,
} = useAddExpense(newExpenses)

function moveToIncome(indexOfExpenseToMove: number) {
  const expenseToMove = newExpenseData.value[indexOfExpenseToMove]
  emit('moveToIncome', expenseToMove)

  deleteNewExpenseRow(indexOfExpenseToMove)
}

function clearAllExpenses() {
  store.clearNewExpenses()
  console.log(store.newExpenses)
  addNewExpenseRow()
}

const tableHeaders = [
  { label: 'Date', required: true },
  { label: 'Name', required: true, customClass: 'w-1/4' },
  { label: 'Net Amount', required: false },
  { label: 'Amount', required: true },
  { label: 'Paid Back', required: false },
  { label: 'Category', required: true },
  { label: 'Subcategory', required: false },
  { label: '', required: false },
]
</script>

<template>
  <table class="w-full table-fixed mb-5">
    <TableHeaders :headers="tableHeaders" />
    <tbody>
      <tr
        class="hover:bg-gray-100/50"
        :class="{ 'bg-red-300/50 hover:bg-red-300/50': validationErrorsIndexes.includes(index) }"
        v-for="(_, index) in newExpenseData"
        :key="index"
      >
        <AddNewExpenseRow v-model="newExpenseData[index]" />
        <td class="text-center p-1" v-if="newExpenseData.length > 1">
          <Button class="w-8/10 text-sm" @click="deleteNewExpenseRow(index)">Delete</Button>
        </td>
        <td class="p-1 text-nowrap">
          <Button class="w-full text-sm" @click="moveToIncome(index)">>> Income</Button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="flex gap-5">
    <Button @click="addNewExpenseRow">Add New Expense Row</Button>
    <Button @click="clearAllExpenses">Clear All Expenses</Button>
    <Button @click="addExpense">Save Expense</Button>
  </div>
  <Error v-if="error" :error="error" />
  <LoadingModal :isModalOpen="loading" message="Saving expenses..." />
</template>

<style scoped></style>
