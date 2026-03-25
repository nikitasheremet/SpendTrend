import type { Expense, NewExpense } from '@/types/expenseData'
import type { Income, NewIncome } from '@/types/income/income'

export const DUPLICATE_SOURCE_NEW = 'new'
export const DUPLICATE_SOURCE_EXISTING = 'existing'

export type DuplicateSource = typeof DUPLICATE_SOURCE_NEW | typeof DUPLICATE_SOURCE_EXISTING

export const DUPLICATE_ENTRY_TYPE_EXPENSE = 'expense'
export const DUPLICATE_ENTRY_TYPE_INCOME = 'income'

export interface ExpenseDuplicateNewMatch {
  source: typeof DUPLICATE_SOURCE_NEW
  draftIndex: number
  row: NewExpense
}

export interface ExpenseDuplicateExistingMatch {
  source: typeof DUPLICATE_SOURCE_EXISTING
  id: string
  row: Expense
}

export type ExpenseDuplicateMatch = ExpenseDuplicateNewMatch | ExpenseDuplicateExistingMatch

export interface ExpenseDuplicateEntry {
  type: typeof DUPLICATE_ENTRY_TYPE_EXPENSE
  duplicateKey: string
  draftIndex: number
  draftRow: NewExpense
  matches: ExpenseDuplicateMatch[]
  isPresentInNew: boolean
  isPresentInExisting: boolean
}

export interface IncomeDuplicateNewMatch {
  source: typeof DUPLICATE_SOURCE_NEW
  draftIndex: number
  row: NewIncome
}

export interface IncomeDuplicateExistingMatch {
  source: typeof DUPLICATE_SOURCE_EXISTING
  id: string
  row: Income
}

export type IncomeDuplicateMatch = IncomeDuplicateNewMatch | IncomeDuplicateExistingMatch

export interface IncomeDuplicateEntry {
  type: typeof DUPLICATE_ENTRY_TYPE_INCOME
  duplicateKey: string
  draftIndex: number
  draftRow: NewIncome
  matches: IncomeDuplicateMatch[]
  isPresentInNew: boolean
  isPresentInExisting: boolean
}
