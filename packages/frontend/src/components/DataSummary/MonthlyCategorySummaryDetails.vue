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
    <td
      class="category-name"
      :class="{ expandable: category.subCategories.length }"
      @click="showSubcategories"
    >
      {{ category.name }}
      <span class="expand-icon"
        ><span v-if="isSubcategoryDetailsShown">▼</span
        ><span v-else-if="category.subCategories.length">▶</span></span
      >
    </td>
    <td>{{ category.total }}</td>
    <td>{{ category.threeMonthAvg }}</td>
    <td>{{ category.diffTotalToAvg }}</td>
    <td>% {{ category.diffTotalToAvgAsPercent }}</td>
  </tr>
  <template v-if="isSubcategoryDetailsShown">
    <MonthlySubcategorySummary :summaryForSelectedMonthBySubcategory="category.subCategories" />
  </template>
</template>

<style scoped>
.expandable {
  cursor: pointer;
}
.category-name {
  display: flex;
  justify-content: space-between;
}
td {
  /* min-width: 150px; */
}
th {
  text-align: left;
}
.expand-icon {
  margin-right: 20px;
}
</style>
