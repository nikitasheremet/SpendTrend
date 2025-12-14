<script lang="ts" setup>
import type { ExpenseCategorySummary } from '@/types/dataSummary'
import MonthlySubcategorySummary from './MonthlySubcategorySummary.vue'
import { ref } from 'vue'
import { showNumberAsDollar } from '@/helpers/showNumberAsDollar'

const { category } = defineProps<{
  category: ExpenseCategorySummary
}>()

const isSubcategoryDetailsShown = ref(false)
function showSubcategories() {
  isSubcategoryDetailsShown.value = !isSubcategoryDetailsShown.value
}
</script>

<template>
  <tr class="border hover:bg-gray-100">
    <td
      class="category-name flex justify-between p-2"
      :class="{ expandable: category.subCategories.length }"
      @click="showSubcategories"
    >
      {{ category.name }}
      <span class="expand-icon"
        ><span v-if="isSubcategoryDetailsShown">▼</span
        ><span v-else-if="category.subCategories.length">▶</span></span
      >
    </td>
    <td class="p-2 text-center">{{ category.total }}</td>
    <td class="p-2 text-center">{{ category.threeMonthAvg }}</td>
    <td class="p-2 text-center">{{ category.diffTotalToAvg }}</td>
    <td class="p-2 text-center">{{ category.diffTotalToAvgAsPercent }}</td>
  </tr>
  <template v-if="isSubcategoryDetailsShown">
    <MonthlySubcategorySummary :summaryForSelectedMonthBySubcategory="category.subCategories" />
  </template>
</template>

<style scoped>
.expandable {
  cursor: pointer;
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
