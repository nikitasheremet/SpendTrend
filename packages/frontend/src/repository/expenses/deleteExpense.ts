import { writeExpenseTransaction } from '@/localDb/schema/expensesObjectStore'

export async function deleteExpense(expenseId: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const expenseObjectStore = writeExpenseTransaction()
    const deleteRequest = expenseObjectStore.delete(expenseId)
    deleteRequest.onsuccess = () => {
      resolve(expenseId)
    }
    deleteRequest.onerror = () => {
      reject(deleteRequest.error)
    }
  })
}
