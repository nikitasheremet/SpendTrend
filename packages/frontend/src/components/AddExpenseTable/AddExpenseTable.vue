<script lang="ts" setup>
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'

const { newExpenseData, addExpense, error } = useAddExpense()
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <AddNewExpenseRow v-model="newExpenseData" />
    </tbody>
  </table>
  <button @click="addExpense">Save Expense</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
