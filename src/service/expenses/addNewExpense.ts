import { saveExpense } from '@/repository/expenses/saveExpense'
import type { NewExpense } from '@/types/expenseData'

export async function addNewExpense<T = NewExpense>(newExpenseData: T): Promise<T> {
  return await saveExpense(newExpenseData)
}
