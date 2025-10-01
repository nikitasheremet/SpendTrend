import { ref, type Ref } from 'vue'
import { updateIncome as serviceUpdateIncome } from '@/service/income/updateIncome'
import { deleteIncome as serviceDeleteIncome } from '@/service/income/deleteIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { Income } from '@/types/income/income'

export function useManageIncome(
  income: Income,
  onErrorCallback: (error: Error) => void,
  onIncomeDeletedCallback: (deletedIncome: Income) => void,
): {
  incomeData: Ref<Income>
  updateIncome: (newValue: unknown, key: keyof Income) => Promise<void>
  deleteIncome: () => Promise<void>
} {
  const incomeData = ref<Income>(income)

  async function updateIncome(newValue: unknown, key: keyof Income): Promise<void> {
    try {
      let valueToUpdate = newValue
      if (key === 'date') {
        valueToUpdate = formatDate(
          new Date(newValue as string | Date).toISOString(),
          DateFormat.YYYY_MM_DD,
        )
      }
      const updatedIncome = { ...incomeData.value, [key]: valueToUpdate }
      await serviceUpdateIncome(updatedIncome)
      incomeData.value = updatedIncome
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  async function deleteIncome(): Promise<void> {
    try {
      await serviceDeleteIncome(incomeData.value.id)
      onIncomeDeletedCallback(incomeData.value)
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  return {
    incomeData,
    updateIncome,
    deleteIncome,
  }
}
