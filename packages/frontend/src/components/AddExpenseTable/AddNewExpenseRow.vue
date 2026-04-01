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
  <AddExpenseCell v-model="newExpenseData.date" type="date" />
  <AddExpenseCell v-model="newExpenseData.name" />
  <AddExpenseCell v-model="newExpenseData.amount" type="number" />
  <AddExpenseCell v-model="newExpenseData.paidBackAmount" type="number" />
  <td class="border p-1">{{ newExpenseData.netAmount.toFixed(2) }}</td>
  <AddExpenseCell
    v-model="expenseCategoryDropdownValue"
    type="dropdown"
    :dropdown-options="categoryNames"
    include-empty-option
    empty-option-label="Uncategorized"
  />
  <AddExpenseCell
    v-model="expenseSubCategoryDropdownValue"
    type="dropdown"
    :dropdown-options="getSubcategories(newExpenseData.category)"
  />
</template>

<style scoped></style>
