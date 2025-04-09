import { ref, type Ref } from 'vue'
import type { NewExpenseData } from '../AddExpenseTable.vue'
import { addNewExpense } from '@/service/expenses/addNewExpense'

function createNewEmptyExpenseData(): NewExpenseData {
  return {
    date: new Date().getTime(),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  }
}

export function useAddExpense(): {
  newExpenseData: Ref<NewExpenseData>
  expenseDataChanged: (changedExpenseData: NewExpenseData) => void
  addExpense: () => Promise<void>
  error: Ref<Error | undefined>
} {
  const newExpenseData = ref<NewExpenseData>(createNewEmptyExpenseData())
  const error = ref<Error | undefined>(undefined)

  function expenseDataChanged(changedExpenseData: NewExpenseData): void {
    newExpenseData.value = changedExpenseData
  }

  async function addExpense() {
    try {
      verifyNewExpenseData(newExpenseData.value)
      await addNewExpense(newExpenseData.value)
      newExpenseData.value = createNewEmptyExpenseData()
    } catch (err) {
      error.value = err as Error
    }
  }

  return {
    newExpenseData,
    expenseDataChanged,
    addExpense,
    error,
  }
}

function verifyNewExpenseData(newExpenseData: NewExpenseData): void {
  if (!newExpenseData.date) {
    throw new Error('Date is required')
  }
}
