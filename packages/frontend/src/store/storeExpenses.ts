import { ref, type Ref } from 'vue'
import type { Expense } from '@/types/expenseData'

export interface StoreExpensesDomain {
  expenses: Ref<Expense[]>
  setExpenses: (newExpenses: Expense[]) => void
  addExpenses: (newExpenses: Expense[]) => void
  updateExpense: (updatedExpense: Expense) => void
  deleteExpense: (expenseId: string) => void
}

export function createStoreExpenses(): StoreExpensesDomain {
  const expensesRef = ref<Expense[]>([])

  const setExpenses = (newExpenses: Expense[]) => {
    expensesRef.value = newExpenses
  }

  const addExpenses = (newExpenses: Expense[]) => {
    expensesRef.value = [...newExpenses, ...expensesRef.value]
  }

  const updateExpense = (updatedExpense: Expense) => {
    const expenseIndex = expensesRef.value.findIndex((expense) => expense.id === updatedExpense.id)
    if (expenseIndex === -1) return

    const updatedExpenses = [...expensesRef.value]
    updatedExpenses[expenseIndex] = updatedExpense
    expensesRef.value = updatedExpenses
  }

  const deleteExpense = (expenseId: string) => {
    expensesRef.value = expensesRef.value.filter((expense) => expense.id !== expenseId)
  }

  return {
    expenses: expensesRef,
    setExpenses,
    addExpenses,
    updateExpense,
    deleteExpense,
  }
}
