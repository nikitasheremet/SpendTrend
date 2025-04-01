import { db } from '@/localDb/db'
import type { Expense } from '@/types/expenseData'

export async function getExpenses(): Promise<Expense[]> {
  const dbExpenses = await new Promise<any>((resolve, reject) => {
    const transaction = db.transaction('expenses', 'readonly')
    const objectStore = transaction.objectStore('expenses')
    const request = objectStore.getAll()
    request.onsuccess = (event) => {
      resolve(request.result)
    }
  })
  return convertDbExpensesToExpenses(dbExpenses)
}

function convertDbExpensesToExpenses(dbExpenses: any[]): Expense[] {
  return dbExpenses.map((expense) => convertDbExpenseToExpense(expense))
}

function convertDbExpenseToExpense(dbExpense: any): Expense {
  return {
    id: dbExpense.id,
    date: dbExpense.date,
    name: dbExpense.name,
    netAmount: dbExpense.netAmount,
    amount: dbExpense.amount,
    paidBackAmount: dbExpense.paidBackAmount,
    category: dbExpense.category,
    subCategory: dbExpense.subCategory,
  }
}
