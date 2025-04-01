import { db } from '@/localDb/db'

export async function deleteExpense(expenseId: string) {
  const transaction = db.transaction('expenses', 'readwrite')
  const objectStore = transaction.objectStore('expenses')
  objectStore.delete(expenseId)
}
