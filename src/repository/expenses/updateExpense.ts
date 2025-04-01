import { db } from '@/localDb/db'
import type { Expense } from '@/types/expenseData'

export function updateExpense(expenseDataToUpdate: Partial<Expense>, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('expenses', 'readwrite')
    const objectStore = transaction.objectStore('expenses')
    const request = objectStore.get(id)
    request.onsuccess = (event) => {
      const expense = request.result
      if (!expense) {
        reject(new Error('Expense not found'))
        return
      }
      const updatedExpense = { ...expense }
      Object.entries(expenseDataToUpdate).forEach(([newDataKey, newDataValue]) => {
        const key = newDataKey as keyof typeof updatedExpense
        const value = newDataValue as (typeof updatedExpense)[typeof key]
        // @ts-ignore
        updatedExpense[key] = value
      })
      updatedExpense.netAmount = updatedExpense.amount - (updatedExpense.paidBackAmount || 0)
      const updateRequest = objectStore.put(updatedExpense)
      updateRequest.onsuccess = () => {
        resolve()
      }
      updateRequest.onerror = (event) => {
        console.error('Error updating expense', updateRequest.error)
        reject()
      }
    }
  })
}
