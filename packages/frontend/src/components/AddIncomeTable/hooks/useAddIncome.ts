import { onMounted, ref, watch, type Ref, inject } from 'vue'
import { addNewIncome } from '@/service/income/addNewIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { NewIncome } from '@/types/income/income'
import { useLoading } from '@/helpers/hooks/useLoading'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowDeletedPopover from '@/components/AddIncomeTable/hooks/RowDeletedPopover.vue'

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
  validationErrorsIndexes: Ref<number[]>
  loading: Ref<boolean>
} {
  const popover = inject<PopoverRef>(POPOVER_SYMBOL)
  const error = ref<Error | undefined>(undefined)
  const validationErrorsIndexes = ref<number[]>([])
  const { loading, startLoading, stopLoading } = useLoading()

  onMounted(() => {
    if (newIncome.value.length === 0) {
      newIncome.value.push(createNewEmptyIncomeData())
    }
  })

  watch(
    newIncome,
    () => {
      if (newIncome.value.length === 0) {
        newIncome.value.push(createNewEmptyIncomeData())
      }
    },
    { deep: true },
  )

  async function addIncome() {
    startLoading()
    try {
      validationErrorsIndexes.value = verifyNewIncomeData(newIncome.value)
      if (validationErrorsIndexes.value.length > 0) {
        throw new Error('Validation errors in highlighted rows. Please fill in required fields')
      }
      const { failedIncomes } = await addNewIncome(newIncome.value)

      if (failedIncomes.length > 0) {
        newIncome.value = failedIncomes.map((failedIncome) => failedIncome.incomeInput)
      } else {
        newIncome.value = [createNewEmptyIncomeData()]
      }
      error.value = undefined
      stopLoading()
    } catch (err) {
      console.log('Error adding new income:', err)
      error.value = err as Error
      stopLoading()
    }
  }

  function addNewIncomeRow() {
    newIncome.value.push(createNewEmptyIncomeData())
  }

  function deleteNewIncomeRow(index: number) {
    newIncome.value.splice(index, 1)
    popover?.value?.showPopover(RowDeletedPopover)
  }

  return {
    newIncomeData: newIncome,
    addIncome,
    addNewIncomeRow,
    deleteNewIncomeRow,
    error,
    validationErrorsIndexes,
    loading,
  }
}

function verifyNewIncomeData(newIncomeData: NewIncome[]): number[] {
  const arrayOfErrorRows: number[] = []
  newIncomeData.forEach((income, index) => {
    try {
      if (!income.name) {
        throw new Error('Name is required')
      }
      if (!income.amount) {
        throw new Error('Amount is required')
      }
      if (!income.date) {
        throw new Error('Date is required')
      }
    } catch (err) {
      arrayOfErrorRows.push(index)
    }
  })
  return arrayOfErrorRows
}
