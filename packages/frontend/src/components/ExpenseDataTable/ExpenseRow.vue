<script lang="ts" setup>
import type { Expense } from '@/types/expenseData'
import ExpenseDataCell from './EditableCell/ExpenseDataCell.vue'
import { useManageExpense } from './hooks/useUpdateExpense'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'

const { expense } = defineProps<{ expense: Expense }>()
const emits = defineEmits<{
  expenseDeleted: [Expense]
  onError: [Error]
}>()
function onError(error: Error) {
  emits('onError', error)
}
function onDeleted(deletedExpense: Expense) {
  emits('expenseDeleted', deletedExpense)
}
const { expenseData, updateExpense, deleteExpense } = useManageExpense(expense, onError, onDeleted)

const { categoryNames, getSubcategories } = useCategoriesInExpenseData()
</script>

<template>
  <tr>
    <ExpenseDataCell
      :data="expenseData.date!"
      type="date"
      @on-save="(value) => updateExpense(value, 'date')"
    />
    <ExpenseDataCell
      :data="expenseData.name"
      type="text"
      @on-save="(value) => updateExpense(value, 'name')"
    />
    <td>{{ expenseData.netAmount }}</td>
    <ExpenseDataCell
      :data="expenseData.amount!"
      type="number"
      @on-save="(value) => updateExpense(value, 'amount')"
    />
    <ExpenseDataCell
      :data="expenseData.paidBackAmount"
      type="number"
      @on-save="(value) => updateExpense(value, 'paidBackAmount')"
    />
    <ExpenseDataCell
      :data="expenseData.category.name"
      type="dropdown"
      :options="categoryNames"
      @on-save="(value) => updateExpense(value, 'category')"
    />
    <ExpenseDataCell
      :data="expenseData.subCategory?.name"
      type="dropdown"
      :options="getSubcategories(expenseData.category.id)"
      @on-save="(value) => updateExpense(value, 'subCategory')"
    />
    <td>
      <button class="delete-expense-button" @click="deleteExpense">Delete</button>
    </td>
  </tr>
</template>

<style scoped></style>
