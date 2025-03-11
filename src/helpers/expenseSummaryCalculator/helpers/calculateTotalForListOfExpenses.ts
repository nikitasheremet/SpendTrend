import type { Expense } from '@/types/expenseData'
import { totalReducer } from './totalReducer'

export function calculateTotalForListOfExpenses(listOfExpenses: Expense[]): number {
  return totalReducer<Expense>('netAmount', listOfExpenses)
}
