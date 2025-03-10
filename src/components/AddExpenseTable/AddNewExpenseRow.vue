<script lang="ts" setup>
import type { NewExpense } from '@/types/expenseData'
import AddExpenseCell from './AddExpenseCell.vue'
import { store } from '@/store/store'
import { computed, ref, watch } from 'vue'

const { newExpenseData } = defineProps<{
  newExpenseData: NewExpense
}>()
const emits = defineEmits<{
  updatedNewExpenseData: [NewExpense]
}>()

const localNewExpenseData = ref(newExpenseData)

const netAmount = computed(() => {
  const { amount, paidBackAmount } = localNewExpenseData.value
  return (amount || 0) - (paidBackAmount || 0)
})

watch(localNewExpenseData.value, (updatedValue) => {
  emits('updatedNewExpenseData', { ...updatedValue, netAmount: netAmount.value })
})
</script>

<template>
  <AddExpenseCell type="date" v-model="localNewExpenseData.date" />
  <AddExpenseCell v-model="localNewExpenseData.name" />
  <td>{{ netAmount }}</td>
  <AddExpenseCell type="number" v-model="localNewExpenseData.amount" />
  <AddExpenseCell type="number" v-model="localNewExpenseData.paidBackAmount" />
  <AddExpenseCell
    type="dropdown"
    v-model="localNewExpenseData.category"
    :dropdown-options="store.getCategories()"
  />
  <AddExpenseCell
    type="dropdown"
    v-model="localNewExpenseData.subCategory"
    :dropdown-options="store.getSubcategories()"
  />
</template>

<style scoped></style>
