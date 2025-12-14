<script lang="ts" setup>
import { computed } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import MonthlyCategorySummaryDetails from './MonthlyCategorySummaryDetails.vue'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(monthModel, yearModel)

const filteredSummaryByCategory = computed(() =>
  summaryForSelectedMonthByCategory.value.filter(
    (category) => category.total > 0 || category.threeMonthAvg > 0,
  ),
)
</script>

<template>
  <h2 class="text-xl font-semibold mb-4">Category Breakdown</h2>
  <table class="w-full table-fixed">
    <thead>
      <tr class="text-l">
        <th class="p-2 text-left">Category</th>
        <th class="p-2">Total ($)</th>
        <th>3 Month Avg ($)</th>
        <th>+/- ($)</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="category in filteredSummaryByCategory" :key="category.name">
        <MonthlyCategorySummaryDetails :category="category" />
      </template>
    </tbody>
  </table>
</template>
