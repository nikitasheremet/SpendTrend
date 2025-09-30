import { ref, watch, type Ref } from 'vue'
import { addNewIncome } from '@/service/income/addNewIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { NewIncome } from '@/types/income/income'

function createNewEmptyIncomeData(): NewIncome {
  return {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    amount: 0,
  }
}

export function useAddIncome(newIncome: Ref<NewIncome[]> = ref([])): {
  newIncomeData: Ref<NewIncome[]>
  addIncome: () => Promise<void>
  addNewIncomeRow: () => void
  deleteNewIncomeRow: (index: number) => void
  error: Ref<Error | undefined>
} {
  const newIncomeData = ref<NewIncome[]>(
    newIncome.value.length ? newIncome.value : [createNewEmptyIncomeData()],
  )
  const error = ref<Error | undefined>(undefined)

  watch(
    newIncome,
    (newVal, oldVal) => {
      newIncomeData.value = [...newVal, ...oldVal]
    },
    { deep: true },
  )

  async function addIncome() {
    try {
      newIncomeData.value.forEach(verifyNewIncomeData)
      await Promise.all(
        newIncomeData.value.map((newIncome) => addNewIncome(newIncome as Required<NewIncome>)),
      )
      newIncomeData.value = [createNewEmptyIncomeData()]
    } catch (err) {
      console.log('Error adding new income:', err)
      error.value = err as Error
    }
  }

  function addNewIncomeRow() {
    newIncomeData.value.push(createNewEmptyIncomeData())
  }

  function deleteNewIncomeRow(index: number) {
    newIncomeData.value.splice(index, 1)
  }

  return {
    newIncomeData,
    addIncome,
    addNewIncomeRow,
    deleteNewIncomeRow,
    error,
  }
}

function verifyNewIncomeData(newIncomeData: NewIncome): void {
  if (!newIncomeData.name) {
    throw new Error('Name is required')
  }
  if (!newIncomeData.amount) {
    throw new Error('Amount is required')
  }
  if (!newIncomeData.date) {
    throw new Error('Date is required')
  }
}
