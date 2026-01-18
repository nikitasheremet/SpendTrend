<script setup lang="ts">
import { useGetIncomes } from './hooks/useGetIncomes'
import Error from '../DesignSystem/Error.vue'
import IncomeRow from './IncomeRow.vue'
import TableHeaders from '../TableHeaders.vue'

const { incomes, error, incomeDeleted } = useGetIncomes()

function handleRowError(newError: Error) {
  error.value = newError
}

const tableHeaders = [{ label: 'Date' }, { label: 'Name' }, { label: 'Amount ($)' }, { label: '' }]
</script>

<template>
  <table class="w-full table-fixed mb-5">
    <TableHeaders :headers="tableHeaders" />
    <tbody>
      <IncomeRow
        v-for="income of incomes"
        :key="income.id"
        :income="income"
        @income-deleted="incomeDeleted"
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
