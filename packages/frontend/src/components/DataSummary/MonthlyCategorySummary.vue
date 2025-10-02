<script lang="ts" setup>
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import MonthlyCategorySummaryDetails from './MonthlyCategorySummaryDetails.vue'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

const { summaryByCategory } = useGetMonthlyExpenseSummary(monthModel, yearModel)
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Total</th>
        <th>3 Month Average</th>
        <th>Diff Value</th>
        <th>Diff Percent</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="category in Object.entries(summaryByCategory)">
        <!-- <MonthlyCategorySummaryDetails :category="category" /> -->
      </template>
    </tbody>
  </table>
</template>

<style scoped></style>
