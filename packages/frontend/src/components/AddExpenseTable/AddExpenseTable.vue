<script lang="ts" setup>
import ExpenseDataTableHead from '../ExpenseDataTableHead.vue'
import AddNewExpenseRow from './AddNewExpenseRow.vue'
import { useAddExpense } from './hooks/useAddExpense'
import Error from '../DesignSystem/Error.vue'
import { NewExpense } from '@/types/expenseData'
import { ref, watch } from 'vue'

const { newExpenses } = defineProps<{
  newExpenses: NewExpense[]
}>()

const newExpenseRows = ref<NewExpense[]>(newExpenses)

watch(
  () => newExpenses,
  (newVal, oldVal) => {
    newExpenseRows.value = [...newVal, ...oldVal]
  },
  { deep: true },
)

const { newExpenseData, addExpense, addNewExpenseRow, deleteNewExpenseRow, error } =
  useAddExpense(newExpenseRows)
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
      </tr>
    </tbody>
  </table>
  <button @click="addNewExpenseRow">Add New Expense Row</button>
  <button @click="addExpense">Save Expense</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
