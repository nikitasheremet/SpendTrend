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
        :top-amount="expenses.total"
        :three-month-avg="expenses.threeMonthAvg"
        :change-amount="expenses.diffTotalToAvg"
        :change-percent="expenses.diffTotalToAvgAsPercent || 0"
        :is-better="isExpensesDoingBetter"
      />
      <MonthlyTotalCard
        title="Income"
        :top-amount="summaryForSelectedMonth.income.total"
        :three-month-avg="summaryForSelectedMonth.income.threeMonthAvg"
        :change-amount="summaryForSelectedMonth.income.diffTotalToAvg"
        :change-percent="summaryForSelectedMonth.income.diffTotalToAvgAsPercent || 0"
        :is-better="isIncomeDoingBetter"
      />
      <MonthlyTotalCard
        title="Savings"
        :top-amount="summaryForSelectedMonth.savings"
        :three-month-avg="0"
        :change-amount="0"
        :change-percent="0"
        :is-better="true"
      />
    </div>
  </div>
</template>

<style scoped></style>
