<script lang="ts" setup>
import { ref } from 'vue'
import MonthlyCategorySummary from './MonthlyCategorySummary.vue'
import MonthlyTotalSummary from './MonthlyTotalSummary.vue'

const selectedMonth = ref(new Date().getUTCMonth())
const selectedYear = ref(new Date().getUTCFullYear())
</script>

<template>
  <MonthlyTotalSummary v-model:month="selectedMonth" v-model:year="selectedYear" />

  <MonthlyCategorySummary :month="selectedMonth" :year="selectedYear" />
</template>

<style scoped></style>
