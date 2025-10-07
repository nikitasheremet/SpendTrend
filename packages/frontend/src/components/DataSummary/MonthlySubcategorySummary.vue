<script lang="ts" setup>
import type { ExpenseSubCategorySummary } from '@/types/dataSummary'

const { summaryForSelectedMonthBySubcategory } = defineProps<{
  summaryForSelectedMonthBySubcategory: ExpenseSubCategorySummary[]
}>()
</script>

<template>
  <tr
    v-for="subcategoryDetails in summaryForSelectedMonthBySubcategory"
    :key="subcategoryDetails.name"
  >
    <td>{{ subcategoryDetails.name }}:</td>
    <td>{{ subcategoryDetails.total }}</td>
    <td>{{ subcategoryDetails.threeMonthAvg }}</td>
    <td>{{ subcategoryDetails.diffTotalToAvg }}</td>
    <td>{{ subcategoryDetails.diffTotalToAvgAsPercent }}</td>
  </tr>
</template>
