import type { Expense, NewExpense } from '@/types/expenseData'
import type { Income, NewIncome } from '@/types/income/income'

const EMPTY_NORMALIZED_VALUE = ''
const DUPLICATE_KEY_PART_SEPARATOR = '|'

function normalizeText(value: string | undefined): string {
  if (!value) {
    return EMPTY_NORMALIZED_VALUE
  }

  return value.trim().toLowerCase()
}

function normalizeDate(value: string | undefined): string {
  if (!value) {
    return EMPTY_NORMALIZED_VALUE
  }

  return value.trim()
}

function normalizeAmount(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    return EMPTY_NORMALIZED_VALUE
  }

  return String(value)
}

function hasRequiredAmount(value: number | undefined): boolean {
  return Boolean(value)
}

function normalizeExpenseCategoryForDuplicateKey(category: string | undefined): string {
  return normalizeText(category)
}

function normalizeExistingExpenseCategoryForDuplicateKey(expense: Expense): string {
  return normalizeText(expense.category?.id)
}

export function isCompleteDraftExpense(expense: NewExpense): boolean {
  return Boolean(
    normalizeDate(expense.date) && normalizeText(expense.name) && hasRequiredAmount(expense.amount),
  )
}

export function isCompleteDraftIncome(income: NewIncome): boolean {
  return Boolean(
    normalizeDate(income.date) && normalizeText(income.name) && hasRequiredAmount(income.amount),
  )
}

function joinKeyParts(parts: string[]): string {
  return parts.join(DUPLICATE_KEY_PART_SEPARATOR)
}

export function buildExpenseDuplicateKeyFromDraft(expense: NewExpense): string | undefined {
  if (!isCompleteDraftExpense(expense)) {
    return undefined
  }

  return joinKeyParts([
    normalizeDate(expense.date),
    normalizeText(expense.name),
    normalizeAmount(expense.amount),
    normalizeExpenseCategoryForDuplicateKey(expense.category),
    normalizeText(expense.subCategory),
  ])
}

export function buildExpenseDuplicateKeyFromExisting(expense: Expense): string {
  return joinKeyParts([
    normalizeDate(expense.date),
    normalizeText(expense.name),
    normalizeAmount(expense.amount),
    normalizeExistingExpenseCategoryForDuplicateKey(expense),
    normalizeText(expense.subCategory?.id),
  ])
}

export function buildIncomeDuplicateKeyFromDraft(income: NewIncome): string | undefined {
  if (!isCompleteDraftIncome(income)) {
    return undefined
  }

  return joinKeyParts([
    normalizeDate(income.date),
    normalizeText(income.name),
    normalizeAmount(income.amount),
  ])
}

export function buildIncomeDuplicateKeyFromExisting(income: Income): string {
  return joinKeyParts([
    normalizeDate(income.date),
    normalizeText(income.name),
    normalizeAmount(income.amount),
  ])
}

export function areDraftRowsEqual<T>(
  previousRow: T | undefined,
  currentRow: T | undefined,
): boolean {
  return JSON.stringify(previousRow) === JSON.stringify(currentRow)
}

export function cloneDraftRows<T extends object>(rows: T[]): T[] {
  return rows.map((row) => ({ ...row }))
}
