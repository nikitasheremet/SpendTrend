<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import { getExpenses } from '@/service/expenses/getExpenses'
import MonthlyTotalCard from './MonthlyTotalCard.vue'

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

const expenses = computed(() => summaryForSelectedMonth.value.expenses)
const isExpensesDoingBetter = computed(() => expenses.value.diffTotalToAvg < 0)

const income = computed(() => summaryForSelectedMonth.value.income)
const isIncomeDoingBetter = computed(() => income.value.diffTotalToAvg > 0)
</script>

<template>
  <div id="monthly-summary-grid">
    <div class="flex items-center mb-8 justify-center text-xl font-bold">
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
    <div class="flex flex-row gap-10 items-center justify-center mb-5">
      <MonthlyTotalCard
        title="Expenses"
        :topAmount="expenses.total"
        :threeMonthAvg="expenses.threeMonthAvg"
        :changeAmount="expenses.diffTotalToAvg"
        :changePercent="expenses.diffTotalToAvgAsPercent || 0"
        :isBetter="isExpensesDoingBetter"
      />
      <MonthlyTotalCard
        title="Income"
        :topAmount="summaryForSelectedMonth.income.total"
        :threeMonthAvg="summaryForSelectedMonth.income.threeMonthAvg"
        :changeAmount="summaryForSelectedMonth.income.diffTotalToAvg"
        :changePercent="summaryForSelectedMonth.income.diffTotalToAvgAsPercent || 0"
        :isBetter="isIncomeDoingBetter"
      />
      <MonthlyTotalCard
        title="Savings"
        :topAmount="summaryForSelectedMonth.savings"
        :threeMonthAvg="0"
        :changeAmount="0"
        :changePercent="0"
        :isBetter="true"
      />
    </div>
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
