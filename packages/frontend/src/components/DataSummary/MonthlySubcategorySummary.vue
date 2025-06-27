<script lang="ts" setup>
import type { ExpenseSummaryBySubcategory } from '@/types/expenseSummary'

const { summaryForSelectedMonthBySubcategory } = defineProps<{
  summaryForSelectedMonthBySubcategory: ExpenseSummaryBySubcategory
}>()
</script>

<template>
  <tr v-for="subcategoryDetails in Object.entries(summaryForSelectedMonthBySubcategory)">
    <td>{{ subcategoryDetails[0] }}:</td>
    <td>{{ subcategoryDetails[1].totalAmount }}</td>
    <td>{{ subcategoryDetails[1].threeMonthAverage }}</td>
    <td>{{ subcategoryDetails[1].diffTotalToAverage }}</td>
    <td>{{ subcategoryDetails[1].diffTotalToAverageAsPercent }}</td>
  </tr>
</template>
