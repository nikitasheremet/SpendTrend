import { ref, watchEffect, type Ref } from 'vue'
import { addNewExpense } from '@/service/expenses/addNewExpense'
import { NewExpense } from '@/types/expenseData'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'

function createNewEmptyExpenseData(): NewExpense {
  return {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  }
}

export function useAddExpense(): {
  newExpenseData: Ref<NewExpense>
  addExpense: () => Promise<void>
  error: Ref<Error | undefined>
} {
  const newExpenseData = ref<NewExpense>(createNewEmptyExpenseData())
  const error = ref<Error | undefined>(undefined)

  watchEffect(() => {
    const { amount, paidBackAmount } = newExpenseData.value
    newExpenseData.value.netAmount = (amount || 0) - (paidBackAmount || 0)
  })

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
    addExpense,
    error,
  }
}

function verifyNewExpenseData(newExpenseData: NewExpense): void {
  if (!newExpenseData.date) {
    throw new Error('Date is required')
  }
}
