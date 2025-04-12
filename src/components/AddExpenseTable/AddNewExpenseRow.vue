<script lang="ts" setup>
import AddExpenseCell from './AddExpenseCell.vue'
import type { NewExpenseData } from './AddExpenseTable.vue'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'

const newExpenseData = defineModel<NewExpenseData>({ required: true })

const { categoryNames, getSubcategories } = useCategoriesInExpenseData()
</script>

<template>
  <AddExpenseCell type="date" v-model="newExpenseData.date" />
  <AddExpenseCell v-model="newExpenseData.name" />
  <td>{{ newExpenseData.netAmount }}</td>
  <AddExpenseCell type="number" v-model="newExpenseData.amount" />
  <AddExpenseCell type="number" v-model="newExpenseData.paidBackAmount" />
  <AddExpenseCell
    type="dropdown"
    v-model="newExpenseData.category"
    :dropdown-options="categoryNames"
  />
  <AddExpenseCell
    type="dropdown"
    v-model="newExpenseData.subCategory"
    :dropdown-options="getSubcategories(newExpenseData.category)"
  />
</template>

<style scoped></style>
