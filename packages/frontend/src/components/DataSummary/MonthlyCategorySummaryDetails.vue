<script lang="ts" setup>
import type { ExpenseCategorySummary } from '@/types/dataSummary'
import MonthlySubcategorySummary from './MonthlySubcategorySummary.vue'
import { computed, ref } from 'vue'

const { category } = defineProps<{
  category: ExpenseCategorySummary
}>()

const isSubcategoryDetailsShown = ref(false)

const hasExpandedContent = computed(() => {
  return category.subCategories.length > 0 || category.uncategorizedExpenses.length > 0
})

function showSubcategories() {
  if (!hasExpandedContent.value) {
    return
  }

  isSubcategoryDetailsShown.value = !isSubcategoryDetailsShown.value
}
</script>

<template>
  <tr class="border hover:bg-gray-100">
    <td
      class="category-name flex justify-between p-2"
      :class="{ expandable: hasExpandedContent }"
      @click="showSubcategories"
    >
      {{ category.name }}
      <span class="expand-icon"
        ><span v-if="isSubcategoryDetailsShown">▼</span
        ><span v-else-if="hasExpandedContent">▶</span></span
      >
    </td>
    <td class="p-2 text-center">{{ category.total }}</td>
    <td class="p-2 text-center">{{ category.threeMonthAvg }}</td>
    <td class="p-2 text-center">{{ category.diffTotalToAvg }}</td>
    <td class="p-2 text-center">{{ category.diffTotalToAvgAsPercent }}</td>
  </tr>
  <template v-if="isSubcategoryDetailsShown">
    <MonthlySubcategorySummary
      :summary-for-selected-month-by-subcategory="category.subCategories"
      :uncategorized-expenses="category.uncategorizedExpenses"
    />
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
