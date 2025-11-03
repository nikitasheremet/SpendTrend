import { ref, watch, type Ref } from 'vue'
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

export function useAddExpense(newExpenses: Ref<NewExpense[]> = ref([])): {
  newExpenseData: Ref<NewExpense[]>
  addExpense: () => Promise<void>
  addNewExpenseRow: () => void
  deleteNewExpenseRow: (index: number) => void
  error: Ref<Error | undefined>
} {
  const error = ref<Error | undefined>(undefined)

  watch(
    newExpenses,
    () => {
      newExpenses.value.forEach((expense) => {
        expense.netAmount = (expense.amount || 0) - (expense.paidBackAmount || 0)
      })
    },
    { deep: true },
  )

  async function addExpense() {
    try {
      newExpenses.value.forEach(verifyNewExpenseData)
      await Promise.all(newExpenses.value.map(addNewExpense))
      newExpenses.value = [createNewEmptyExpenseData()]
    } catch (err) {
      console.log('Error adding new expense:', err)
      error.value = err as Error
    }
  }

  function addNewExpenseRow() {
    newExpenses.value.push(createNewEmptyExpenseData())
  }

  function deleteNewExpenseRow(index: number) {
    newExpenses.value.splice(index, 1)
  }

  return {
    newExpenseData: newExpenses,
    addExpense,
    addNewExpenseRow,
    deleteNewExpenseRow,
    error,
  }
}

function verifyNewExpenseData(newExpenseData: NewExpense): void {
  if (!newExpenseData.date) {
    throw new Error('Date is required')
  }
}
