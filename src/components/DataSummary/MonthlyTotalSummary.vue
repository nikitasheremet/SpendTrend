<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import { getListOfYears } from '@/service/expenses/getListOfYears'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

const listOfYears = ref<number[]>([])

onMounted(() => {
  getListOfYears().then((years) => {
    const currentYear = new Date().getUTCFullYear()
    const yearsWithCurrentYear = Array.from(new Set([...years, currentYear].sort((a, b) => a - b)))
    listOfYears.value = yearsWithCurrentYear
  })
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

const { summaryForSelectedMonth } = useGetMonthlyExpenseSummary(monthModel, yearModel)
</script>

<template>
  <div id="monthly-summary-grid">
    <p>Year</p>
    <p>Month</p>
    <p>Total</p>
    <p>3 Month Average</p>
    <p>Diff Value</p>
    <p>Diff Percent</p>
    <select v-model="yearModel">
      <option v-for="year in listOfYears" :value="year">{{ year }}</option>
    </select>
    <select v-model="monthModel">
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
