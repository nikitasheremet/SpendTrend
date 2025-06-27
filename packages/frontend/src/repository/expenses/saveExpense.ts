import { db } from '@/localDb/db'
import type { NewExpense } from '@/types/expenseData'

export function saveExpense<T = NewExpense>(newExpense: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction('expenses', 'readwrite')
    const objectStore = transaction.objectStore('expenses')
    const newExpenseToAdd = { ...newExpense, id: crypto.randomUUID() }
    const request = objectStore.add(newExpenseToAdd)
    request.onsuccess = () => {
      resolve(newExpenseToAdd)
    }
    request.onerror = () => {
      reject(request.error)
    }
  })
}
