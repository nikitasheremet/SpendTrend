import { writeExpenseTransaction } from '@/localDb/schema/expensesObjectStore'
import type { Expense } from '@/types/expenseData'

export function updateExpense(updatedExpense: Expense): Promise<Expense> {
  return new Promise<Expense>((resolve, reject) => {
    const expenseObjectStore = writeExpenseTransaction()
    const updateRequest = expenseObjectStore.put(updatedExpense)
    updateRequest.onsuccess = () => {
      resolve(updatedExpense)
    }
    updateRequest.onerror = () => {
      reject(updateRequest.error)
    }
  })
}
