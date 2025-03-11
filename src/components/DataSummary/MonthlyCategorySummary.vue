<script lang="ts" setup>
import { store } from '@/store/store'
import { ref } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'

const thisMonth = ref(new Date().getUTCMonth())
const thisYear = ref(new Date().getUTCFullYear())

const { summaryForSelectedMonthByCategory } = useGetMonthlyExpenseSummary(thisMonth, thisYear)
</script>

<template>
  <div id="category-grid">
    <p>Category</p>
    <p>Total</p>
    <p>3 Month Average</p>
    <p>Diff Value</p>
    <p>Diff Percent</p>
    <template v-for="categoryDetails in Object.entries(summaryForSelectedMonthByCategory)">
      <span>{{ categoryDetails[0] }}: </span><span>{{ categoryDetails[1].totalAmount }}</span
      ><span>{{ categoryDetails[1].threeMonthAverage }}</span
      ><span>{{ categoryDetails[1].diffTotalToAverage }}</span
      ><span>{{ categoryDetails[1].diffTotalToAverageAsPercent }}</span>
    </template>
  </div>
</template>

<style scoped>
#category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
</style>
