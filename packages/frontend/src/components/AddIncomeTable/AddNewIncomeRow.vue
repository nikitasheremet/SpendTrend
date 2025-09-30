<script lang="ts" setup>
import { NewIncome } from '@/types/income/income'
import AddIncomeCell from './AddIncomeCell.vue'

const newIncomeData = defineModel<NewIncome>({
  required: true,
})
</script>

<template>
  <AddIncomeCell type="date" v-model="newIncomeData.date" />
  <AddIncomeCell v-model="newIncomeData.name" />
  <AddIncomeCell type="number" v-model="newIncomeData.amount" />
</template>

<style scoped></style>
