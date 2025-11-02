<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import { getExpenses } from '@/service/expenses/getExpenses'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

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

const { summaryForSelectedMonth } = useGetMonthlyExpenseSummary(monthModel, yearModel)
</script>

<template>
  <div id="monthly-summary-grid">
    <div style="display: flex; align-items: baseline; margin-bottom: 1rem">
      <h4>Data for:</h4>
      <div class="selectors">
        <select v-model="monthModel">
          <option v-for="month in listOfMonths" :value="month[1]">{{ month[0] }}</option>
        </select>
      </div>
      <div class="selectors">
        <select v-model="yearModel">
          <option v-for="year in listOfYears" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <table id="monthly-totals-table">
      <tr>
        <th>Monthly Expenses</th>
        <th>3 Month Average</th>
        <th>Difference</th>
        <th>% Difference</th>
      </tr>
      <tr></tr>
      <tr>
        <td>{{ summaryForSelectedMonth.expenses.total }}</td>
        <td>{{ summaryForSelectedMonth.expenses.threeMonthAvg }}</td>
        <td>{{ summaryForSelectedMonth.expenses.diffTotalToAvg }}</td>
        <td>% {{ summaryForSelectedMonth.expenses.diffTotalToAvgAsPercent }}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>Monthly Income</th>
        <th>3 Month Average</th>
        <th>Difference</th>
        <th>% Difference</th>
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
  margin-left: 0.5rem;
}
td {
  min-width: 150px;
  font-size: 20px;
}
table {
  width: 60vw;
  margin-bottom: 20px;
}
th {
  text-align: left;
}
</style>
