<script lang="ts" setup>
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'
import { NewExpense } from '@/types/expenseData'
import { ref, watch } from 'vue'

const newExpenses = defineModel<NewExpense[]>({ required: true })

const emit = defineEmits<{
  moveToIncome: [expense: NewExpense]
}>()

const { newExpenseData, addExpense, addNewExpenseRow, deleteNewExpenseRow, error } =
  useAddExpense(newExpenses)

function moveToIncome(indexOfExpenseToMove: number) {
  const expenseToMove = newExpenseData.value[indexOfExpenseToMove]
  emit('moveToIncome', expenseToMove)

  deleteNewExpenseRow(indexOfExpenseToMove)
}
</script>

<template>
  <table>
    <ExpenseDataTableHead />
    <tbody>
      <tr v-for="(_, index) in newExpenseData" :key="index">
        <AddNewExpenseRow v-model="newExpenseData[index]" />
        <td v-if="newExpenseData.length > 1">
          <button @click="deleteNewExpenseRow(index)">Delete</button>
        </td>
        <td>
          <button @click="moveToIncome(index)">Move to Income</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button @click="addNewExpenseRow">Add New Expense Row</button>
  <button @click="addExpense">Save Expense</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
