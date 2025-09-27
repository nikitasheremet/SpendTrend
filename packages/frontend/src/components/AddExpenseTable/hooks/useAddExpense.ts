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
  const newExpenseData = ref<NewExpense[]>(
    newExpenses.value.length ? newExpenses.value : [createNewEmptyExpenseData()],
  )
  const error = ref<Error | undefined>(undefined)

  watch(
    newExpenses,
    (newVal, oldVal) => {
      newExpenseData.value = [...newVal, ...oldVal]
    },
    { deep: true },
  )

  watch(
    newExpenseData,
    () => {
      newExpenseData.value.forEach((expense) => {
        expense.netAmount = (expense.amount || 0) - (expense.paidBackAmount || 0)
      })
    },
    { deep: true },
  )

  async function addExpense() {
    try {
      newExpenseData.value.forEach(verifyNewExpenseData)
      await Promise.all(newExpenseData.value.map(addNewExpense))
      newExpenseData.value = [createNewEmptyExpenseData()]
    } catch (err) {
      console.log('Error adding new expense:', err)
      error.value = err as Error
    }
  }

  function addNewExpenseRow() {
    newExpenseData.value.push(createNewEmptyExpenseData())
  }

  function deleteNewExpenseRow(index: number) {
    newExpenseData.value.splice(index, 1)
  }

  return {
    newExpenseData,
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
