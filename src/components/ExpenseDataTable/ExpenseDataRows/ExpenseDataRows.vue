<script lang="ts" setup>
import type { Expense } from '@/types/expenseData'
import { store } from '@/store/store'
import ExpenseDataCell from '../EditableCell/ExpenseDataCell.vue'
import { onMounted, ref } from 'vue'

const expenses = ref<Expense[]>([])

onMounted(async () => {
  expenses.value = await store.getAllExpenses()
})

async function updateData(
  valueToUpdate: string | number | undefined,
  valueName: keyof Expense,
  expenseId: string,
) {
  await store.updateExpense({ [valueName]: valueToUpdate }, expenseId)
  expenses.value = expenses.value.map((expense) => {
    if (expense.id === expenseId) {
      return {
        ...expense,
        [valueName]: valueToUpdate,
      }
    }
    return expense
  })
}

async function handleDelete(expenseId: string) {
  await store.deleteExpense(expenseId)
  expenses.value = expenses.value.filter((expense) => expense.id !== expenseId)
}
</script>

<template>
  <tr v-for="expense of expenses" class="expense-data-row" :key="expense.id">
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
    <td>
      <button class="delete-expense-button" @click="handleDelete(expense.id)">Delete</button>
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 0 8px;
  border: grey 1px solid;
}
.delete-expense-button {
  display: none;
}
.expense-data-row:hover {
  .delete-expense-button {
    display: block;
  }
}
</style>
