<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getStore } from '@/store/store'
import { useScrollPast } from '@/helpers/hooks/useScrollPast'
import MonthlyCategorySummary from './MonthlyCategorySummary.vue'
import MonthlyTotalSummary from './MonthlyTotalSummary.vue'

const SUMMARY_PERIOD_STICKY_TOP_PX = 60

const store = getStore()
const summaryPeriodRef = ref<HTMLElement | null>(null)
const { hasScrolledPast } = useScrollPast(summaryPeriodRef, {
  triggerOffsetPx: SUMMARY_PERIOD_STICKY_TOP_PX,
})

const listOfYears = computed<number[]>(() => {
  const years = store.expenses.value.reduce((acc, expense) => {
    const year = new Date(expense.date).getUTCFullYear()
    acc.add(year)
    return acc
  }, new Set<number>())

  const currentYear = new Date().getUTCFullYear()
  return Array.from(new Set([...Array.from(years), currentYear].sort((a, b) => a - b)))
})

const listOfMonths = [
  ['Jan', 0],
  ['Feb', 1],
  ['Mar', 2],
  ['Apr', 3],
  ['May', 4],
  ['Jun', 5],
  ['Jul', 6],
  ['Aug', 7],
  ['Sep', 8],
  ['Oct', 9],
  ['Nov', 10],
  ['Dec', 11],
]

function handleSummaryPeriodSelectionChange() {
  store.markSummaryPeriodAsManuallySelected()
}

onMounted(() => {
  store.applyLatestExpenseSummaryPeriodDefault()
})
</script>

<template>
  <div
    ref="summaryPeriodRef"
    class="flex items-center mb-8 justify-center text-xl font-bold"
    :class="{ 'sticky z-30 bg-white pb-3': hasScrolledPast }"
    :style="hasScrolledPast ? { top: `${SUMMARY_PERIOD_STICKY_TOP_PX}px` } : undefined"
  >
    <h4>Data for:</h4>
    <div class="flex flex-col ml-2">
      <select
        class="min-w-15"
        v-model="store.selectedMonth.value"
        @change="handleSummaryPeriodSelectionChange"
      >
        <option v-for="month in listOfMonths" :key="month[1]" :value="month[1]">
          {{ month[0] }}
        </option>
      </select>
    </div>
    <div class="flex flex-col ml-2">
      <select
        class="min-w-17"
        v-model="store.selectedYear.value"
        @change="handleSummaryPeriodSelectionChange"
      >
        <option v-for="year in listOfYears" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
  </div>

  <MonthlyTotalSummary
    v-model:month="store.selectedMonth.value"
    v-model:year="store.selectedYear.value"
  />

  <MonthlyCategorySummary :month="store.selectedMonth.value" :year="store.selectedYear.value" />
</template>

<style scoped></style>
