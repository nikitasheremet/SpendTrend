<script lang="ts" setup>
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'

export type NewExpenseData = {
  date?: number
  name?: string
  netAmount?: number
  amount?: number
  paidBackAmount?: number
  category?: string
  subCategory?: string
}

const { newExpenseData, expenseDataChanged, addExpense, error } = useAddExpense()
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <AddNewExpenseRow
        :newExpenseData="newExpenseData"
        @updatedNewExpenseData="expenseDataChanged"
      />
    </tbody>
  </table>
  <button @click="addExpense">Save Expense</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
