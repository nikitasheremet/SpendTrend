<script lang="ts" setup>
import type { Expense } from '@/types/expenseData'
import { store } from '@/store/store'
import ExpenseDataCell from '../EditableCell/ExpenseDataCell.vue'

function updateData(
  valueToUpdate: string | number | undefined,
  valueName: keyof Expense,
  expenseId: string,
) {
  store.updateExpense({ [valueName]: valueToUpdate }, expenseId)
}
</script>

<template>
  <tr v-for="expense of store.getAllExpenses()">
    <ExpenseDataCell
      :data="expense.date!"
      type="date"
      @on-save="(value) => updateData(value, 'date', expense.id)"
    />
    <ExpenseDataCell
      :data="expense.name"
      type="text"
      @on-save="(value) => updateData(value, 'name', expense.id)"
    />
    <td>{{ expense.netAmount }}</td>
    <ExpenseDataCell
      :data="expense.amount!"
      type="number"
      @on-save="(value) => updateData(value, 'amount', expense.id)"
    />
    <ExpenseDataCell
      :data="expense.paidBackAmount"
      type="number"
      @on-save="(value) => updateData(value, 'paidBackAmount', expense.id)"
    />
    <ExpenseDataCell
      :data="expense.category"
      type="dropdown"
      subtype="categories"
      @on-save="(value) => updateData(value, 'category', expense.id)"
    />
    <ExpenseDataCell
      :data="expense.subCategory"
      type="dropdown"
      subtype="subcategories"
      @on-save="(value) => updateData(value, 'subCategory', expense.id)"
    />
  </tr>
</template>

<style scoped>
td {
  padding: 0 8px;
  border: grey 1px solid;
}
</style>
