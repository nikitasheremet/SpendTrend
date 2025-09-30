<script lang="ts" setup>
import AddNewIncomeRow from './AddNewIncomeRow.vue'
import { useAddIncome } from './hooks/useAddIncome'
import Error from '../DesignSystem/Error.vue'
import { NewIncome } from '@/types/income/income'
import { ref, watch } from 'vue'
import IncomeDataTableHead from '../IncomeDataTable/IncomeDataTableHead.vue'

const { newIncomes } = defineProps<{
  newIncomes: NewIncome[]
}>()

const newIncomesRows = ref<NewIncome[]>(newIncomes)

watch(
  () => newIncomes,
  (newVal, oldVal) => {
    newIncomesRows.value = [...newVal, ...oldVal]
  },
  { deep: true },
)

const { newIncomeData, addIncome, addNewIncomeRow, deleteNewIncomeRow, error } =
  useAddIncome(newIncomesRows)
</script>

<template>
  <table>
    <IncomeDataTableHead />
    <tbody>
      <tr v-for="(_, index) in newIncomeData" :key="index">
        <AddNewIncomeRow v-model="newIncomeData[index]" />
        <td v-if="newIncomeData.length > 1">
          <button @click="deleteNewIncomeRow(index)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button @click="addNewIncomeRow">Add New Income Row</button>
  <button @click="addIncome">Save Income</button>
  <Error v-if="error" :error="error" />
</template>

<style scoped></style>
