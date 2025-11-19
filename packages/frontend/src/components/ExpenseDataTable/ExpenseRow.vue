<script lang="ts" setup>
import type { Expense } from '@/types/expenseData'
import ExpenseDataCell from './EditableCell/ExpenseDataCell.vue'
import { useManageExpense } from './hooks/useUpdateExpense'
import { useCategoriesInExpenseData } from '@/helpers/hooks/useGetCategories'
import Button from '../DesignSystem/Button/Button.vue'

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

const { categoryNames, getCategory, getSubcategories } = useCategoriesInExpenseData()

const onSaveCategory = async (name: string) => {
  const category = getCategory(name)
  await updateExpense({ ...category }, 'category')
  await updateExpense(undefined, 'subCategory')
}

const onSaveSubCategory = async (name: string) => {
  const category = getCategory(expenseData.value.category.name)
  const subcategoryToUpdate = category.subCategories?.find((sub) => sub.name === name)
  if (!subcategoryToUpdate) {
    return
  }

  updateExpense(subcategoryToUpdate, 'subCategory')
}
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
    <td class="border p-1">{{ expenseData.netAmount }}</td>
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
      @on-save="(value) => onSaveCategory(value as string)"
    />
    <ExpenseDataCell
      :data="expenseData.subCategory?.name"
      type="dropdown"
      :options="getSubcategories(expenseData.category.id)"
      @on-save="(value) => onSaveSubCategory(value as string)"
    />
    <td class="text-center p-1">
      <Button class="delete-expense-button" @click="deleteExpense">Delete</Button>
    </td>
  </tr>
</template>

<style scoped></style>
