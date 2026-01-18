<script lang="ts" setup>
import AddNewIncomeRow from './AddNewIncomeRow.vue'
import { useAddIncome } from './hooks/useAddIncome'
import Error from '../DesignSystem/Error.vue'
import { NewIncome } from '@/types/income/income'
import Button from '../DesignSystem/Button/Button.vue'
import TableHeaders from '../TableHeaders.vue'
import LoadingModal from '../DesignSystem/Modal/LoadingModal.vue'
import { getStore } from '@/store/store'

const newIncomes = defineModel<NewIncome[]>({ required: true })

const store = getStore()

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
  loading,
} = useAddIncome(newIncomes)

function clearAllIncomes() {
  if (confirm("Are you sure that you want to clear all incomes? This can't be undone")) {
    store.clearNewIncomes()
    addNewIncomeRow()
  }
}

function moveToExpense(indexOfIncomeToMove: number) {
  const incomeToMove = newIncomeData.value[indexOfIncomeToMove]
  emit('moveToExpense', incomeToMove)

  deleteNewIncomeRow(indexOfIncomeToMove)
}

const tableHeaders = [
  { label: 'Date', required: true },
  { label: 'Name', required: true },
  { label: 'Amount ($)', required: true },
]
</script>

<template>
  <table class="w-200 table-fixed mb-5">
    <TableHeaders :headers="tableHeaders" />
    <tbody>
      <tr
        class="hover:bg-gray-100/50"
        :class="{ 'bg-red-300/50 hover:bg-red-300/50': validationErrorsIndexes.includes(index) }"
        v-for="(_, index) in newIncomeData"
        :key="index"
      >
        <AddNewIncomeRow v-model="newIncomeData[index]" />
        <td class="text-center p-1" v-if="newIncomeData.length > 1">
          <Button class="w-8/10 text-sm" @click="deleteNewIncomeRow(index)">Delete</Button>
        </td>
        <td class="p-1">
          <Button class="text-sm" @click="moveToExpense(index)">>> Expense</Button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="flex gap-5">
    <Button @click="addNewIncomeRow">Add New Income Row</Button>
    <Button @click="clearAllIncomes">Clear All Income</Button>
    <Button @click="addIncome">Save Income</Button>
  </div>
  <Error v-if="error" :error="error" />
  <LoadingModal :isModalOpen="loading" message="Saving incomes..." />
</template>

<style scoped></style>
