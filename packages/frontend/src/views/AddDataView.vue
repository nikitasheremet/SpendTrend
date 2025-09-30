<script setup lang="ts">
import AddExpenseTable from '@/components/AddExpenseTable/AddExpenseTable.vue'
import AddIncomeTable from '@/components/AddIncomeTable/AddIncomeTable.vue'
import { DataType, formatBankData } from '@/helpers/bankInfoFormatting/formatBankData'
import { NewExpense } from '@/types/expenseData'
import { NewIncome } from '@/types/income/income'
import { ref } from 'vue'

const pastedData = ref('')

const newExpenses = ref<NewExpense[]>([])
const newIncomes = ref<NewIncome[]>([])

function formatData() {
  const createdData = formatBankData(pastedData.value)
  console.log('Created data:', createdData)
  const newExpensesToAdd = createdData
    .filter((data) => data.type === DataType.EXPENSE)
    .map((data) => ({
      date: data.date,
      name: data.name,
      amount: Math.abs(data.amount),
      netAmount: Math.abs(data.amount),
      paidBackAmount: 0,
      category: '',
      subCategory: '',
    }))
  newExpenses.value = newExpensesToAdd
  const newIncomesToAdd = createdData
    .filter((data) => data.type === DataType.INCOME)
    .map((data) => ({
      date: data.date,
      name: data.name,
      amount: data.amount,
    }))
  newIncomes.value = newIncomesToAdd
}

const currentTab = ref<'expense' | 'income'>('expense')
</script>

<template>
  <textarea v-model="pastedData" />
  <button @click="formatData">Format Data</button>
  <div>
    <button :class="{ 'is-active': currentTab === 'expense' }" @click="currentTab = 'expense'">
      Expense
    </button>
    <button :class="{ 'is-active': currentTab === 'income' }" @click="currentTab = 'income'">
      Income
    </button>
  </div>
  <div :class="{ hidden: currentTab !== 'expense' }">
    <AddExpenseTable :newExpenses="newExpenses" />
  </div>
  <div :class="{ hidden: currentTab !== 'income' }">
    <AddIncomeTable :newIncomes="newIncomes" />
  </div>
</template>

<style>
.is-active {
  background-color: darkgrey;
}
.hidden {
  display: none;
}
</style>
