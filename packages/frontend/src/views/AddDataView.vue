<script setup lang="ts">
import AddExpenseTable from '@/components/AddExpenseTable/AddExpenseTable.vue'
import AddIncomeTable from '@/components/AddIncomeTable/AddIncomeTable.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import TabViewNav from '@/components/DesignSystem/TabViewNav/TabViewNav.vue'
import { DataType, formatBankData } from '@/helpers/bankInfoFormatting/formatBankData'
import { NewExpense } from '@/types/expenseData'
import { NewIncome } from '@/types/income/income'
import { ref } from 'vue'
import { getStore } from '@/store/store'

const store = getStore()
const pastedData = ref('')
const currentTab = ref<'expense' | 'income'>('expense')

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
  newExpensesToAdd.forEach((expense) => store.addNewExpense(expense))

  const newIncomesToAdd = createdData
    .filter((data) => data.type === DataType.INCOME)
    .map((data) => ({
      date: data.date,
      name: data.name,
      amount: Math.abs(data.amount),
    }))
  newIncomesToAdd.forEach((income) => store.addNewIncome(income))
}

function moveToIncome(expense: NewExpense) {
  store.addNewIncome({
    date: expense.date,
    name: expense.name,
    amount: expense.amount,
  })
}

function moveToExpense(income: NewIncome) {
  store.addNewExpense({
    date: income.date || '',
    name: income.name || '',
    amount: income.amount || 0,
    netAmount: income.amount || 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  })
}

const formatDataPlaceholder =
  'Paste your bank data here. Copy it directly from your bank website and click format data.'
</script>

<template>
  <div class="flex items-center gap-7 mb-5">
    <textarea
      :placeholder="formatDataPlaceholder"
      class="border border-gray-300 rounded-md p-2 w-1/2"
      v-model="pastedData"
    />
    <Button @click="formatData">Format Data</Button>
  </div>
  <TabViewNav
    :tabs="[
      { label: 'Expenses', value: 'expense' },
      { label: 'Income', value: 'income' },
    ]"
    :currentTab="currentTab"
    @tabClicked="(tabValue) => (currentTab = tabValue as typeof currentTab)"
  />
  <div v-if="currentTab === 'expense'">
    <AddExpenseTable v-model="store.newExpenses.value" @moveToIncome="moveToIncome" />
  </div>
  <div v-if="currentTab === 'income'">
    <AddIncomeTable v-model="store.newIncomes.value" @moveToExpense="moveToExpense" />
  </div>
</template>

<style>
.is-active {
  background-color: darkgrey;
}
</style>
