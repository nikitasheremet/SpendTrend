import { onMounted, ref, watch, type Ref } from 'vue'
import { addNewExpense } from '@/service/expenses/addNewExpense'
import { NewExpense } from '@/types/expenseData'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { useLoading } from '@/helpers/hooks/useLoading'

function createNewEmptyExpenseData(): NewExpense {
  return {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: undefined,
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
  validationErrorsIndexes: Ref<number[]>
  loading: Ref<boolean>
} {
  const error = ref<Error | undefined>(undefined)
  const validationErrorsIndexes = ref<number[]>([])
  const { loading, startLoading, stopLoading } = useLoading()

  onMounted(() => {
    if (newExpenses.value.length === 0) {
      newExpenses.value.push(createNewEmptyExpenseData())
    }
  })

  watch(
    newExpenses,
    () => {
      if (newExpenses.value.length === 0) {
        newExpenses.value.push(createNewEmptyExpenseData())
      }
      newExpenses.value.forEach((expense) => {
        expense.netAmount = (expense.amount || 0) - (expense.paidBackAmount || 0)
      })
    },
    { deep: true },
  )

  async function addExpense() {
    startLoading()
    try {
      validationErrorsIndexes.value = verifyNewExpenseData(newExpenses.value)
      if (validationErrorsIndexes.value.length > 0) {
        throw new Error('Validation errors in highlighted rows. Please fill in required fields')
      }
      await Promise.all(newExpenses.value.map(addNewExpense))
      newExpenses.value = [createNewEmptyExpenseData()]
      error.value = undefined
      stopLoading()
    } catch (err) {
      console.log('Error adding new expense:', err)
      error.value = err as Error
      stopLoading()
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
    validationErrorsIndexes,
    loading,
  }
}

function verifyNewExpenseData(newExpenseData: NewExpense[]): number[] {
  const arrayOfErrorRows: number[] = []
  newExpenseData.forEach((expense, index) => {
    try {
      if (!expense.date) {
        throw new Error('Date is required')
      }
      if (!expense.name) {
        throw new Error('Name is required')
      }
      if (!expense.amount) {
        throw new Error('Amount is required')
      }
      if (!expense.category) {
        throw new Error('Category is required')
      }
    } catch (err) {
      arrayOfErrorRows.push(index)
    }
  })
  return arrayOfErrorRows
}
