<script setup lang="ts">
import type { Expense, NewExpense } from '@/types/expenseData'
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput.vue'
import { ref, defineProps, watch } from 'vue'
import { store } from '@/store/store'

const { expenseData } = defineProps<{
  expenseData: NewExpense
}>()
const emit = defineEmits<{
  onChange: [NewExpense]
}>()
const newExpenseData = ref<NewExpense>(expenseData)

watch(
  [() => expenseData.amount, () => newExpenseData.value.paidBackAmount],
  ([amount, paidBackAmount]) => {
    newExpenseData.value.netAmount = (amount || 0) - (paidBackAmount || 0)
  },
)

watch(
  () => newExpenseData.value,
  (expense) => {
    emit('onChange', expense)
  },
  {
    deep: true,
  },
)

function updateCategory(categoryValue: string) {
  newExpenseData.value.category = categoryValue
}
function updateSubcategory(subcategoryValue: string) {
  newExpenseData.value.subCategory = subcategoryValue
}
</script>

<template>
  <div class="add-expense-row">
    <div class="new-expense-input">
      <label for="expense-date-input">Expense Date</label>
      <input id="expense-date-input" type="date" v-model="newExpenseData.date" />
    </div>
    <div class="new-expense-input">
      <label for="expense-name-input">Expense Name</label>
      <input id="expense-name-input" type="text" v-model="newExpenseData.name" />
    </div>
    <div class="new-expense-input">
      <label>Net Amount</label>
      <input v-model="newExpenseData.netAmount" disabled />
    </div>
    <div class="new-expense-input">
      <label for="expense-amount-input">Expense Amount</label>
      <input id="expense-amount-input" type="number" min="0" v-model="newExpenseData.amount" />
    </div>
    <div class="new-expense-input">
      <label for="expense-paid-back-amount-input">Expense Paid Back</label>
      <input
        id="expense-paid-back-amount-input"
        type="number"
        min="0"
        v-model="newExpenseData.paidBackAmount"
      />
    </div>
    <div class="new-expense-input">
      <label>Expense Category</label>
      <DropdownWithInput
        :dropdown-options="store.categories"
        @on-change="updateCategory"
        :dropdown-value="newExpenseData.category"
      />
    </div>
    <div class="new-expense-input">
      <label>Expense Sub-Category</label>
      <DropdownWithInput
        :dropdown-options="store.subcategories"
        @on-change="updateSubcategory"
        :dropdown-value="newExpenseData.subCategory"
      />
    </div>
  </div>
</template>

<style>
.add-expense-row {
  display: flex;
  flex-direction: row;
}
.new-expense-input {
  display: flex;
  flex-direction: column;
}
</style>
