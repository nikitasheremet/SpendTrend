<script lang="ts" setup>
import type { ExpenseSubCategorySummary } from '@/types/dataSummary'

const { summaryForSelectedMonthBySubcategory } = defineProps<{
  summaryForSelectedMonthBySubcategory: ExpenseSubCategorySummary[]
}>()
</script>

<template>
  <tr
    class="border border-gray-400 text-sm hover:bg-gray-100"
    v-for="subcategoryDetails in summaryForSelectedMonthBySubcategory"
    :key="subcategoryDetails.name"
  >
    <td class="subcategory-name p-2">{{ subcategoryDetails.name }}</td>
    <td class="p-2 text-center">{{ subcategoryDetails.total }}</td>
    <td class="p-2 text-center">{{ subcategoryDetails.threeMonthAvg }}</td>
    <td class="p-2 text-center">{{ subcategoryDetails.diffTotalToAvg }}</td>
    <td class="p-2 text-center">{{ subcategoryDetails.diffTotalToAvgAsPercent }}</td>
  </tr>
</template>

<style scoped>
.subcategory-name {
  padding-left: 30px;
}
</style>
