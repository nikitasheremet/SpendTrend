import { ref, type Ref } from 'vue'
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
  const error = ref<Error | undefined>(undefined)

  async function addIncome() {
    try {
      newIncome.value.forEach(verifyNewIncomeData)
      await Promise.all(
        newIncome.value.map((newIncome) => addNewIncome(newIncome as Required<NewIncome>)),
      )
      newIncome.value = [createNewEmptyIncomeData()]
    } catch (err) {
      console.log('Error adding new income:', err)
      error.value = err as Error
    }
  }

  function addNewIncomeRow() {
    newIncome.value.push(createNewEmptyIncomeData())
  }

  function deleteNewIncomeRow(index: number) {
    newIncome.value.splice(index, 1)
  }

  return {
    newIncomeData: newIncome,
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
