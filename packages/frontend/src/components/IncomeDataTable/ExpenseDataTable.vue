<script setup lang="ts">
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import { useGetExpenses } from './hooks/useGetExpenses'
import Error from '../DesignSystem/Error.vue'
import ExpenseRow from './ExpenseRow.vue'

const { expenses, error, expenseDeleted } = useGetExpenses()

function handleRowError(newError: Error) {
  error.value = newError
}
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <ExpenseRow
        v-for="expense of expenses"
        :key="expense.id"
        :expense="expense"
        @expense-deleted="expenseDeleted"
        @on-error="handleRowError"
      />
    </tbody>
  </table>
  <Error v-if="error" :error="error" />
</template>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
