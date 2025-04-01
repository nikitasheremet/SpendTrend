import { db } from '@/localDb/db'
import type { NewExpense } from '@/types/expenseData'

export function saveExpense(newExpense: NewExpense): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('expenses', 'readwrite')
    const objectStore = transaction.objectStore('expenses')
    const request = objectStore.add({ ...newExpense, id: crypto.randomUUID() })
    request.onsuccess = (event) => {
      resolve()
    }
    request.onerror = (event) => {
      console.error('Error adding expense', request.error)
      reject()
    }
  })
}
