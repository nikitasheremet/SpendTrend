<script setup lang="ts">
import AddExpenseTable from '@/components/AddExpenseTable/AddExpenseTable.vue'
import AddIncomeTable from '@/components/AddIncomeTable/AddIncomeTable.vue'
import Button from '@/components/DesignSystem/Button/Button.vue'
import TabViewNav from '@/components/DesignSystem/TabViewNav/TabViewNav.vue'
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
      amount: Math.abs(data.amount),
    }))
  newIncomes.value = newIncomesToAdd
}

const currentTab = ref<'expense' | 'income'>('expense')

function moveToIncome(expense: NewExpense) {
  newIncomes.value.push({
    date: expense.date,
    name: expense.name,
    amount: expense.amount,
  })
}

function moveToExpense(income: NewIncome) {
  newExpenses.value.push({
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
  <div :class="{ hidden: currentTab !== 'expense' }">
    <AddExpenseTable v-model="newExpenses" @moveToIncome="moveToIncome" />
  </div>
  <div :class="{ hidden: currentTab !== 'income' }">
    <AddIncomeTable v-model="newIncomes" @moveToExpense="moveToExpense" />
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
