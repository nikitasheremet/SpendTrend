<script setup lang="ts">
import AddExpenseTable from '@/components/AddExpenseTable/AddExpenseTable.vue'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { NewExpense } from '@/types/expenseData'
import { ref } from 'vue'

const pastedData = ref('')

const newExpenses = ref<NewExpense[]>([])

const EXPENSE = 'expense'
const INCOME = 'income'

function formatData() {
  const splitData = pastedData.value.split(/([\t\n]+)/)
  const rows: string[][] = []
  let nextRow: string[] = []
  const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/

  for (let i = 0; i < splitData.length; i++) {
    const isValidDate = regex.test(splitData[i])
    const isNextRowFilled = Boolean(nextRow.length)
    if (isValidDate) {
      if (isNextRowFilled) {
        rows.push(nextRow)
        nextRow = [splitData[i]]
      } else {
        nextRow.push(splitData[i])
      }
    } else {
      nextRow.push(splitData[i])
    }
    // This is the last row
    if (i === splitData.length - 1) {
      rows.push(nextRow)
    }
  }
  console.log('Parsed rows:', rows)
  const createdData = rows.map((row) => {
    const lastRowCell = row[row.length - 1]
    const newData: {
      date: string
      name: string
      amount: number
      type?: string
    } = {
      date: '',
      name: '',
      amount: 0,
      type: undefined,
    }
    newData.date = formatDate(new Date(row[0] as string), DateFormat.YYYY_MM_DD)
    const indexOfFirstAmount = row.findIndex((cell) => (cell as string).includes('$'))
    if (indexOfFirstAmount < 0) {
      throw new Error('NO AMOUNT PRESENT IN ROW')
    }
    const dataDescription = row
      .slice(1, indexOfFirstAmount)
      .join(' ')
      .replaceAll(/([\t\n]+)/g, '')
      .trim()
    newData.name = dataDescription
    const dataAmount = (row[indexOfFirstAmount] as string).replace('$', '').replace(',', '')
    newData.amount = parseFloat(dataAmount)
    const indexOfSecondAmount = row.findLastIndex((cell) => (cell as string).includes('$'))
    const isThereTwoAmounts = indexOfSecondAmount > indexOfFirstAmount
    const isRbcData = row[1] === '\t\n'

    if (isRbcData) {
      if (newData.amount < 0) {
        if (lastRowCell.includes('\t\t\t')) {
          newData.type = EXPENSE
        } else {
          newData.type = INCOME
        }
      }
      if (newData.amount > 0) {
        if (isThereTwoAmounts) {
          newData.type = INCOME
        } else {
          newData.type = EXPENSE
        }
      }
    }

    return newData
  })
  console.log('Created data:', createdData)
  const newExpensesToAdd = createdData
    .filter((data) => data.type === EXPENSE)
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
}
</script>

<template>
  <textarea v-model="pastedData" />
  <button @click="formatData">Format Data</button>
  <AddExpenseTable :newExpenses="newExpenses" />
</template>

<style></style>
