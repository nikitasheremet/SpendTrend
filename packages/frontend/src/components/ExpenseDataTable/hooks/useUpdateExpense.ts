import type { Expense } from '@/types/expenseData'
import { ref, type Ref, inject } from 'vue'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { POPOVER_SYMBOL } from '@/types/providedSymbols'
import type { PopoverRef } from '@/types/designSystem'
import RowNotificationPopover from '@/components/ExpenseDataTable/hooks/RowNotificationPopover.vue'

export function useManageExpense(
  expense: Expense,
  onErrorCallback: (error: Error) => void,
  onExpenseDeletedCallback: (deletedExpense: Expense) => void,
): {
  expenseData: Ref<Expense>
  updateExpense: (newValue: unknown, key: keyof Expense) => Promise<void>
  deleteExpense: () => Promise<void>
} {
  const popover = inject<PopoverRef>(POPOVER_SYMBOL)
  const expenseData = ref<Expense>(expense)

  async function updateExpense(newValue: unknown, key: keyof Expense): Promise<void> {
    try {
      const valueHasNotChanged = JSON.stringify(expenseData.value[key]) == JSON.stringify(newValue)
      if (valueHasNotChanged) {
        // No change detected, do not update
        return
      }

      if (key === 'date') {
        newValue = formatDate(
          new Date(newValue as string | Date).toISOString(),
          DateFormat.YYYY_MM_DD,
        )
      }
      const updatedExpense = { ...expenseData.value, [key]: newValue }
      if (key === 'amount' || key === 'paidBackAmount') {
        updatedExpense.netAmount =
          (updatedExpense.amount || 0) - (updatedExpense.paidBackAmount || 0)
      }
      await serviceUpdateExpense(updatedExpense)
      expenseData.value = updatedExpense
      popover?.value?.showPopover(RowNotificationPopover, { message: 'Row updated' })
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  async function deleteExpense(): Promise<void> {
    try {
      await serviceDeleteExpense(expenseData.value.id)
      popover?.value?.showPopover(RowNotificationPopover, { message: 'Row deleted' })
      onExpenseDeletedCallback(expenseData.value)
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  return {
    expenseData,
    updateExpense,
    deleteExpense,
  }
}
