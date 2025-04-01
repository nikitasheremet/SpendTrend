<script lang="ts" setup>
import { store } from '@/store/store'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import { ref } from 'vue'
async function getListOfYearsFromExpenses(): Promise<number[]> {
  const allExpenses = await store.getAllExpenses()
  return [
    ...allExpenses.reduce((prev, expense) => {
      return prev.add(new Date(expense.date).getUTCFullYear())
    }, new Set<number>()),
  ]
}
const listOfYears = await getListOfYearsFromExpenses()
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

const currentSelectedYear = ref(new Date().getUTCFullYear())
const currentSelectedMonth = ref(new Date().getUTCMonth())
const { summaryForSelectedMonth } = useGetMonthlyExpenseSummary(
  currentSelectedMonth,
  currentSelectedYear,
)
console.log(summaryForSelectedMonth.value)
</script>

<template>
  <div id="monthly-summary-grid">
    <p>Year</p>
    <p>Month</p>
    <p>Total</p>
    <p>3 Month Average</p>
    <p>Diff Value</p>
    <p>Diff Percent</p>
    <select v-model="currentSelectedYear">
      <option v-for="year in listOfYears" :value="year">{{ year }}</option>
    </select>
    <select v-model="currentSelectedMonth">
      <option v-for="month in listOfMonths" :value="month[1]">{{ month[0] }}</option>
    </select>
    <p>{{ summaryForSelectedMonth.totalAmount }}</p>
    <p>{{ summaryForSelectedMonth.threeMonthAverage }}</p>
    <p>{{ summaryForSelectedMonth.diffTotalToAverage }}</p>
    <p>{{ summaryForSelectedMonth.diffTotalToAverageAsPercent }}</p>
  </div>
</template>

<style scoped>
#monthly-summary-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr 1fr;
}
</style>
