<script lang="ts" setup>
import { ref } from 'vue'
import { store } from '@/store/store'
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import type { NewExpense } from '@/types/expenseData'

export type NewExpenseData = {
  date?: number
  name?: string
  netAmount?: number
  amount?: number
  paidBackAmount?: number
  category?: string
  subCategory?: string
}

function createNewEmptyExpenseData(): NewExpenseData {
  return {
    date: new Date().getTime(),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  }
}

const newExpenseData = ref<NewExpenseData>(createNewEmptyExpenseData())
function handleNewExpenseDataChanged(changedNewExpenseData: NewExpenseData) {
  newExpenseData.value = changedNewExpenseData
}

async function saveExpenseData() {
  const { date } = newExpenseData.value
  // verify that date is not undefined
  if (!date) {
    console.error('Date is required')
    return
  }
  await store.addExpense(newExpenseData.value as NewExpense)
  newExpenseData.value = createNewEmptyExpenseData()
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
