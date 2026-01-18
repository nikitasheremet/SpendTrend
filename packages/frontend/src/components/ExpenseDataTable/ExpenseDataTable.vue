<script setup lang="ts">
import ExpenseDataTableHead from '../TableHeaders.vue'
import { useGetExpenses } from './hooks/useGetExpenses'
import Error from '../DesignSystem/Error.vue'
import ExpenseRow from './ExpenseRow.vue'
import TableHeaders from '../TableHeaders.vue'

const { expenses, error, expenseDeleted } = useGetExpenses()

function handleRowError(newError: Error) {
  error.value = newError
}
const tableHeaders = [
  { label: 'Date', customClass: 'w-1/7' },
  { label: 'Name', customClass: 'w-1/4' },
  { label: 'Amount ($)' },
  { label: 'Paid Back ($)' },
  { label: 'Net Amount ($)' },
  { label: 'Category' },
  { label: 'Subcategory' },
  { label: '' },
]
</script>

<template>
  <table class="w-full table-fixed mb-5">
    <TableHeaders :headers="tableHeaders" />
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
