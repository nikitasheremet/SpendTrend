<script lang="ts" setup>
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import MonthlyCategorySummaryDetails from './MonthlyCategorySummaryDetails.vue'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(monthModel, yearModel)
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Category Breakdown</h2>
  <table class="w-full table-fixed">
    <thead>
      <tr class="text-l text-left">
        <th class="p-2">Category</th>
        <th class="p-2">Total</th>
        <th>3 Month Average</th>
        <th>Difference</th>
        <th>% Difference</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="category in summaryForSelectedMonthByCategory" :key="category.name">
        <MonthlyCategorySummaryDetails :category="category" />
      </template>
    </tbody>
  </table>
</template>
