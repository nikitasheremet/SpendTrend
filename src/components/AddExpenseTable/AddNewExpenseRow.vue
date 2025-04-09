<script lang="ts" setup>
import AddExpenseCell from './AddExpenseCell.vue'
import { store } from '@/store/store'
import { computed } from 'vue'
import type { NewExpenseData } from './AddExpenseTable.vue'

const { newExpenseData } = defineProps<{
  newExpenseData: NewExpenseData
}>()
const emits = defineEmits<{
  updatedNewExpenseData: [NewExpenseData]
}>()

const localNewExpenseData = computed({
  get: () => newExpenseData,
  set: (value) => {
    emits('updatedNewExpenseData', {
      ...value,
      netAmount: (value.amount || 0) - (value.paidBackAmount || 0),
    })
  },
})

const netAmount = computed(() => {
  const { amount, paidBackAmount } = localNewExpenseData.value
  return (amount || 0) - (paidBackAmount || 0)
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
