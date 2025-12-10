import { ref, type Ref, inject } from 'vue'
import { updateIncome as serviceUpdateIncome } from '@/service/income/updateIncome'
import { deleteIncome as serviceDeleteIncome } from '@/service/income/deleteIncome'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { Income } from '@/types/income/income'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowNotificationPopover from '@/components/IncomeDataTable/hooks/RowNotificationPopover.vue'

export function useManageIncome(
  income: Income,
  onErrorCallback: (error: Error) => void,
  onIncomeDeletedCallback: (deletedIncome: Income) => void,
): {
  incomeData: Ref<Income>
  updateIncome: (newValue: unknown, key: keyof Income) => Promise<void>
  deleteIncome: () => Promise<void>
} {
  const popover = inject<PopoverRef>(POPOVER_SYMBOL)
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
      popover?.value?.showPopover(RowNotificationPopover, { message: 'Row updated' })
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  async function deleteIncome(): Promise<void> {
    try {
      await serviceDeleteIncome(incomeData.value.id)
      popover?.value?.showPopover(RowNotificationPopover, { message: 'Row deleted' })
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
