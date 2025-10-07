<script lang="ts" setup>
import type { ExpenseCategorySummary } from '@/types/dataSummary'
import MonthlySubcategorySummary from './MonthlySubcategorySummary.vue'
import { ref } from 'vue'

const { category } = defineProps<{
  category: ExpenseCategorySummary
}>()

const isSubcategoryDetailsShown = ref(false)
function showSubcategories() {
  isSubcategoryDetailsShown.value = !isSubcategoryDetailsShown.value
}
</script>

<template>
  <tr>
    <td @click="showSubcategories">{{ category.name }}</td>
    <td>{{ category.total }}</td>
    <td>{{ category.threeMonthAvg }}</td>
    <td>{{ category.diffTotalToAvg }}</td>
    <td>{{ category.diffTotalToAvgAsPercent }}</td>
  </tr>
  <template v-if="isSubcategoryDetailsShown">
    <MonthlySubcategorySummary :summaryForSelectedMonthBySubcategory="category.subCategories" />
  </template>
</template>

<style scoped></style>
