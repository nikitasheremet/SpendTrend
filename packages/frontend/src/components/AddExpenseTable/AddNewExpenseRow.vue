<script lang="ts" setup>
import { NewExpense } from '@/types/expenseData'
import AddExpenseCell from './AddExpenseCell.vue'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import { computed } from 'vue'

const {
  categoryNames,
  getCategoryName,
  getCategoryId,
  getSubCategoryId,
  getSubCategoryName,
  getSubcategories,
} = useCategoriesInExpenseData()

const newExpenseData = defineModel<NewExpense>({
  required: true,
})

const expenseCategoryDropdownValue = computed({
  get() {
    return getCategoryName(newExpenseData.value.category)
  },
  set(value: string) {
    newExpenseData.value.category = getCategoryId(value)
  },
})

const expenseSubCategoryDropdownValue = computed({
  get() {
    return getSubCategoryName(newExpenseData.value.category, newExpenseData.value.subCategory)
  },
  set(value: string) {
    newExpenseData.value.subCategory = getSubCategoryId(newExpenseData.value.category, value)
  },
})
</script>

<template>
  <AddExpenseCell type="date" v-model="newExpenseData.date" />
  <AddExpenseCell v-model="newExpenseData.name" />
  <AddExpenseCell type="number" v-model="newExpenseData.amount" />
  <AddExpenseCell type="number" v-model="newExpenseData.paidBackAmount" />
  <td class="border p-1">{{ newExpenseData.netAmount }}</td>
  <AddExpenseCell
    type="dropdown"
    v-model="expenseCategoryDropdownValue"
    :dropdown-options="categoryNames"
  />
  <AddExpenseCell
    type="dropdown"
    v-model="expenseSubCategoryDropdownValue"
    :dropdown-options="getSubcategories(newExpenseData.category)"
  />
</template>

<style scoped></style>
