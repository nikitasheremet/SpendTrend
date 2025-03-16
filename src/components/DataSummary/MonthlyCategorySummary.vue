<script lang="ts" setup>
import { ref } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import MonthlyCategorySummaryDetails from './MonthlyCategorySummaryDetails.vue'

const thisMonth = ref(new Date().getUTCMonth())
const thisYear = ref(new Date().getUTCFullYear())

const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(thisMonth, thisYear)
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
      <template v-for="category in Object.entries(summaryForSelectedMonthByCategory)">
        <MonthlyCategorySummaryDetails
          :category="category[0]"
          :monthSummaryForSelectedCategory="category[1]"
        />
      </template>
    </tbody>
  </table>
</template>

<style scoped></style>
