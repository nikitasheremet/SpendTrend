import type { Expense } from '@/types/expenseData'
import { ref, type Ref } from 'vue'
import { updateExpense as serviceUpdateExpense } from '@/service/expenses/updateExpense'
import { deleteExpense as serviceDeleteExpense } from '@/service/expenses/deleteExpense'

export function useManageExpense(
  expense: Expense,
  onErrorCallback: (error: Error) => void,
  onExpenseDeletedCallback: (deletedExpense: Expense) => void,
): {
  expenseData: Ref<Expense>
  updateExpense: (newValue: any, key: keyof Expense) => Promise<void>
  deleteExpense: () => Promise<void>
} {
  const expenseData = ref<Expense>(expense)

  async function updateExpense(newValue: any, key: keyof Expense): Promise<void> {
    try {
      const updatedExpense = { ...expenseData.value, [key]: newValue }
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
