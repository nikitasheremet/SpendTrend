import { ref, type Ref } from 'vue'
import type { NewExpense } from '@/types/expenseData'
import type { NewIncome } from '@/types/income/income'
import { saveExpensesToStorage, saveIncomesToStorage } from './storeDraftPersistence'

export interface StoreDraftsDomain {
  newExpenses: Ref<NewExpense[]>
  newIncomes: Ref<NewIncome[]>
  addNewExpense: (expense: NewExpense) => void
  addNewIncome: (income: NewIncome) => void
  clearNewExpenses: () => void
  clearNewIncomes: () => void
}

function shouldReplaceSingleEmptyExpense(expenses: NewExpense[]): boolean {
  if (expenses.length !== 1) {
    return false
  }

  const [onlyExpenseRow] = expenses
  return !onlyExpenseRow.name && !onlyExpenseRow.netAmount
}

function shouldReplaceSingleEmptyIncome(incomes: NewIncome[]): boolean {
  if (incomes.length !== 1) {
    return false
  }

  const [onlyIncomeRow] = incomes
  return !onlyIncomeRow.name && !onlyIncomeRow.amount
}

export function createStoreDrafts(): StoreDraftsDomain {
  const newExpensesRef = ref<NewExpense[]>([])
  const newIncomesRef = ref<NewIncome[]>([])

  const addNewExpense = (expense: NewExpense) => {
    if (shouldReplaceSingleEmptyExpense(newExpensesRef.value)) {
      newExpensesRef.value = [expense]
      saveExpensesToStorage(newExpensesRef.value)
      return
    }

    newExpensesRef.value.push(expense)
    saveExpensesToStorage(newExpensesRef.value)
  }

  const addNewIncome = (income: NewIncome) => {
    if (shouldReplaceSingleEmptyIncome(newIncomesRef.value)) {
      newIncomesRef.value = [income]
      saveIncomesToStorage(newIncomesRef.value)
      return
    }

    newIncomesRef.value.push(income)
    saveIncomesToStorage(newIncomesRef.value)
  }

  const clearNewExpenses = () => {
    newExpensesRef.value = []
    saveExpensesToStorage(newExpensesRef.value)
  }

  const clearNewIncomes = () => {
    newIncomesRef.value = []
    saveIncomesToStorage(newIncomesRef.value)
  }

  return {
    newExpenses: newExpensesRef,
    newIncomes: newIncomesRef,
    addNewExpense,
    addNewIncome,
    clearNewExpenses,
    clearNewIncomes,
  }
}
