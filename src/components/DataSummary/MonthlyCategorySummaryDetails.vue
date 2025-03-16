<script lang="ts" setup>
import type { CategorySummary } from '@/types/expenseSummary'
import MonthlySubcategorySummary from './MonthlySubcategorySummary.vue'
import { ref } from 'vue'

const { category, monthSummaryForSelectedCategory } = defineProps<{
  category: string
  monthSummaryForSelectedCategory: CategorySummary
}>()

const isSubcategoryDetailsShown = ref(false)
function showSubcategories() {
  isSubcategoryDetailsShown.value = !isSubcategoryDetailsShown.value
}
</script>

<template>
  <tr>
    <td @click="showSubcategories">{{ category }}</td>
    <td>{{ monthSummaryForSelectedCategory.totalAmount }}</td>
    <td>{{ monthSummaryForSelectedCategory.threeMonthAverage }}</td>
    <td>{{ monthSummaryForSelectedCategory.diffTotalToAverage }}</td>
    <td>{{ monthSummaryForSelectedCategory.diffTotalToAverageAsPercent }}</td>
  </tr>
  <template v-if="isSubcategoryDetailsShown">
    <MonthlySubcategorySummary
      :summaryForSelectedMonthBySubcategory="monthSummaryForSelectedCategory.subcategories"
    />
  </template>
</template>

<style scoped></style>
