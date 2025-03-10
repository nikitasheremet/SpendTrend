<script lang="ts" setup>
import { ref } from 'vue'
import { store } from '@/store/store'
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import type { NewExpense } from '@/types/expenseData'

export type NewExpenseData = {
  date?: Date
  name?: string
  netAmount?: number
  amount?: number
  paidBack?: number
  category?: string
  subCategory?: string
}

const newExpenseData = ref<NewExpense>({
  date: new Date().getTime(),
  name: '',
  netAmount: 0,
  amount: 0,
  category: '',
  subCategory: '',
})
function handleNewExpenseDataChanged(changedNewExpenseData: NewExpense) {
  newExpenseData.value = changedNewExpenseData
}

function saveExpenseData() {
  console.log('New data to be saved:', newExpenseData.value)
  store.addExpense(newExpenseData.value)
}
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <AddNewExpenseRow
        :newExpenseData="newExpenseData"
        @updatedNewExpenseData="handleNewExpenseDataChanged"
      />
    </tbody>
  </table>
  <button @click="saveExpenseData">Save Expense</button>
</template>

<style scoped></style>
