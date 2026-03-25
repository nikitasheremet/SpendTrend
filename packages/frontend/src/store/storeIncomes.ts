import { ref, type Ref } from 'vue'
import type { Income } from '@/types/income/income'

export interface StoreIncomesDomain {
  incomes: Ref<Income[]>
  setIncomes: (newIncomes: Income[]) => void
  addIncomes: (newIncomes: Income[]) => void
  updateIncome: (updatedIncome: Income) => void
  deleteIncome: (incomeId: string) => void
}

export function createStoreIncomes(): StoreIncomesDomain {
  const incomesRef = ref<Income[]>([])

  const setIncomes = (newIncomes: Income[]) => {
    incomesRef.value = newIncomes
  }

  const addIncomes = (newIncomes: Income[]) => {
    incomesRef.value = [...newIncomes, ...incomesRef.value]
  }

  const updateIncome = (updatedIncome: Income) => {
    const incomeIndex = incomesRef.value.findIndex((income) => income.id === updatedIncome.id)
    if (incomeIndex === -1) return

    const updatedIncomes = [...incomesRef.value]
    updatedIncomes[incomeIndex] = updatedIncome
    incomesRef.value = updatedIncomes
  }

  const deleteIncome = (incomeId: string) => {
    incomesRef.value = incomesRef.value.filter((income) => income.id !== incomeId)
  }

  return {
    incomes: incomesRef,
    setIncomes,
    addIncomes,
    updateIncome,
    deleteIncome,
  }
}
