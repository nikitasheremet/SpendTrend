<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getStore } from '@/store/store'
import MonthlyCategorySummary from './MonthlyCategorySummary.vue'
import MonthlyTotalSummary from './MonthlyTotalSummary.vue'

const store = getStore()

const listOfYears = ref<number[]>([])

onMounted(async () => {
  const allExpenses = await getExpenses()
  const years = allExpenses.reduce((acc, expense) => {
    const year = new Date(expense.date).getUTCFullYear()
    acc.add(year)
    return acc
  }, new Set<number>())

  const currentYear = new Date().getUTCFullYear()
  const yearsWithCurrentYear = Array.from(
    new Set([...Array.from(years), currentYear].sort((a, b) => a - b)),
  )
  listOfYears.value = yearsWithCurrentYear
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
</script>

<template>
  <div class="flex items-center mb-8 justify-center text-xl font-bold">
    <h4>Data for:</h4>
    <div class="flex flex-col ml-2">
      <select class="min-w-15" v-model="store.selectedMonth.value">
        <option v-for="month in listOfMonths" :value="month[1]">{{ month[0] }}</option>
      </select>
    </div>
    <div class="flex flex-col ml-2">
      <select class="min-w-17" v-model="store.selectedYear.value">
        <option v-for="year in listOfYears" :value="year">{{ year }}</option>
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
