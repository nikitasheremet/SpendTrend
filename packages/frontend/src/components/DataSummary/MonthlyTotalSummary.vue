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
    <div style="display: flex">
      <div class="selectors">
        <p>Year</p>
        <select v-model="yearModel">
          <option v-for="year in listOfYears" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="selectors">
        <p>Month</p>
        <select v-model="monthModel">
          <option v-for="month in listOfMonths" :value="month[1]">{{ month[0] }}</option>
        </select>
      </div>
    </div>
    <table>
      <tr>
        <th>Total Expense</th>
        <th>3 Month Average</th>
        <th>Diff Value</th>
        <th>Diff Percent</th>
      </tr>
      <tr>
        <td>{{ summaryForSelectedMonth.expenses.total }}</td>
        <td>{{ summaryForSelectedMonth.expenses.threeMonthAvg }}</td>
        <td>{{ summaryForSelectedMonth.expenses.diffTotalToAvg }}</td>
        <td>% {{ summaryForSelectedMonth.expenses.diffTotalToAvgAsPercent }}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>Total Income</th>
        <th>3 Month Average</th>
        <th>Income Diff Value</th>
        <th>Income Diff Percent</th>
        <th>Savings</th>
      </tr>
      <tr>
        <td>{{ summaryForSelectedMonth.income.total }}</td>
        <td>{{ summaryForSelectedMonth.income.threeMonthAvg }}</td>
        <td>{{ summaryForSelectedMonth.income.diffTotalToAvg }}</td>
        <td>% {{ summaryForSelectedMonth.income.diffTotalToAvgAsPercent }}</td>
        <td>{{ summaryForSelectedMonth.savings }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
#monthly-summary-grid {
  display: flex;
  flex-direction: column;
}
.selectors {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
td {
  text-align: center;
}
table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}
</style>
