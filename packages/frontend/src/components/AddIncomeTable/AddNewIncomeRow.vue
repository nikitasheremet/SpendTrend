<script lang="ts" setup>
import { NewIncome } from '@/types/income/income'
import AddIncomeCell from './AddIncomeCell.vue'

const newIncomeData = defineModel<NewIncome>({
  required: true,
})
</script>

<template>
  <AddIncomeCell v-model="newIncomeData.date" type="date" />
  <AddIncomeCell v-model="newIncomeData.name" />
  <AddIncomeCell v-model="newIncomeData.amount" type="number" />
</template>

<style scoped></style>
