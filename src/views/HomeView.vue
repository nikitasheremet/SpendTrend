<script setup lang="ts">
import MonthlyCategorySummary from '@/components/DataSummary/MonthlyCategorySummary.vue'
import MonthlyTotalSummary from '@/components/DataSummary/MonthlyTotalSummary.vue'
import ExpenseInputRow from '@/components/ExpenseInputRow/ExpenseInputRow.vue'
import { store } from '@/store/store'
</script>

<template>
  <MonthlyTotalSummary />
  <MonthlyCategorySummary />
</template>
