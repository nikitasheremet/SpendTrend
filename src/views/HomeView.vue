<script setup lang="ts">
import MonthlyCategorySummary from '@/components/DataSummary/MonthlyCategorySummary.vue'
import MonthlyTotalSummary from '@/components/DataSummary/MonthlyTotalSummary.vue'
</script>

<template>
  <Suspense>
    <MonthlyTotalSummary />
  </Suspense>
  <MonthlyCategorySummary />
</template>
