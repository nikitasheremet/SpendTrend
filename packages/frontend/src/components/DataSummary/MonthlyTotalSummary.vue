<script lang="ts" setup>
import { computed } from 'vue'
import { useGetMonthlyExpenseSummary } from './helpers/useGetMonthlyExpenseSummary'
import MonthlyTotalCard from './MonthlyTotalCard.vue'

const monthModel = defineModel<number>('month', { required: true })
const yearModel = defineModel<number>('year', { required: true })

const { summaryForSelectedMonth } = useGetMonthlyExpenseSummary(monthModel, yearModel)

const expenses = computed(() => summaryForSelectedMonth.value.expenses)
const isExpensesDoingBetter = computed(() => expenses.value.diffTotalToAvg < 0)

const income = computed(() => summaryForSelectedMonth.value.income)
const isIncomeDoingBetter = computed(() => income.value.diffTotalToAvg > 0)
</script>

<template>
  <div id="flex flex-col">
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

<style scoped></style>
