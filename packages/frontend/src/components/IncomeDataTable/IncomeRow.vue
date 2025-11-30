<script lang="ts" setup>
import type { Income } from '@/types/income/income'
import IncomeDataCell from './EditableCell/IncomeDataCell.vue'
import { useManageIncome } from './hooks/useUpdateIncome'
import Button from '../DesignSystem/Button/Button.vue'

const { income } = defineProps<{ income: Income }>()
const emits = defineEmits<{
  incomeDeleted: [Income]
  onError: [Error]
}>()
function onError(error: Error) {
  emits('onError', error)
}
function onDeleted(deletedIncome: Income) {
  emits('incomeDeleted', deletedIncome)
}
const { incomeData, updateIncome, deleteIncome } = useManageIncome(income, onError, onDeleted)
</script>

<template>
  <tr>
    <IncomeDataCell
      :data="incomeData.date!"
      type="date"
      @on-save="(value) => updateIncome(value, 'date')"
    />
    <IncomeDataCell
      :data="incomeData.name"
      type="text"
      @on-save="(value) => updateIncome(value, 'name')"
    />
    <IncomeDataCell
      :data="incomeData.amount!"
      type="number"
      @on-save="(value) => updateIncome(value, 'amount')"
    />
    <td class="p-1">
      <Button class="delete-income-button" @click="deleteIncome">Delete</Button>
    </td>
  </tr>
</template>

<style scoped></style>
