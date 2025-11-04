<script lang="ts" setup>
import AddNewIncomeRow from './AddNewIncomeRow.vue'
import { useAddIncome } from './hooks/useAddIncome'
import Error from '../DesignSystem/Error.vue'
import { NewIncome } from '@/types/income/income'
import { ref, watch } from 'vue'
import IncomeDataTableHead from '../IncomeDataTable/IncomeDataTableHead.vue'

const newIncomes = defineModel<NewIncome[]>({ required: true })

const emit = defineEmits<{
  moveToExpense: [income: NewIncome]
}>()

const {
  newIncomeData,
  addIncome,
  addNewIncomeRow,
  deleteNewIncomeRow,
  error,
  validationErrorsIndexes,
} = useAddIncome(newIncomes)

function moveToExpense(indexOfIncomeToMove: number) {
  const incomeToMove = newIncomeData.value[indexOfIncomeToMove]
  emit('moveToExpense', incomeToMove)

  deleteNewIncomeRow(indexOfIncomeToMove)
}
</script>

<template>
  <table>
    <IncomeDataTableHead />
    <tbody>
      <tr
        class="new-income-row"
        :class="{ 'has-errors': validationErrorsIndexes.includes(index) }"
        v-for="(_, index) in newIncomeData"
        :key="index"
      >
        <AddNewIncomeRow v-model="newIncomeData[index]" />
        <td v-if="newIncomeData.length > 1">
          <button @click="deleteNewIncomeRow(index)">Delete</button>
        </td>
        <td>
          <button @click="moveToExpense(index)">Move to Expense</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button @click="addNewIncomeRow">Add New Income Row</button>
  <button @click="addIncome">Save Income</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped>
.has-errors {
  background-color: #ffcccc;
}
table {
  border-collapse: collapse;
}
td {
  padding: 5px;
}
.new-income-row:hover {
  background-color: lightgray;
}
</style>
