import type { Expense } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'

export function useManageExpense(
  expense: Expense,
  onErrorCallback: (error: Error) => void,
  onExpenseDeletedCallback: (deletedExpense: Expense) => void,
): {
  expenseData: Ref<Expense>
  updateExpense: (newValue: unknown, key: keyof Expense) => Promise<void>
  deleteExpense: () => Promise<void>
} {
  const expenseData = ref<Expense>(expense)

  async function updateExpense(newValue: unknown, key: keyof Expense): Promise<void> {
    try {
      let valueToUpdate = newValue
      if (key === 'date') {
        valueToUpdate = formatDate(
          new Date(newValue as string | Date).toISOString(),
          DateFormat.YYYY_MM_DD,
        )
      }
      const updatedExpense = { ...expenseData.value, [key]: valueToUpdate }
      if (key === 'amount' || key === 'paidBackAmount') {
        updatedExpense.netAmount =
          (updatedExpense.amount || 0) - (updatedExpense.paidBackAmount || 0)
      }
      await serviceUpdateExpense(updatedExpense)
      expenseData.value = updatedExpense
    } catch (err) {
      onErrorCallback(err as Error)
    }
  }

  async function deleteExpense(): Promise<void> {
    try {
      await serviceDeleteExpense(expenseData.value.id)
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
