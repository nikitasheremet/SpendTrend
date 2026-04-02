import { ref, type Ref } from 'vue'
import type { Expense, NewExpense } from '@/types/expenseData'
import {
  DUPLICATE_ENTRY_TYPE_EXPENSE,
  DUPLICATE_SOURCE_EXISTING,
  DUPLICATE_SOURCE_NEW,
  type ExpenseDuplicateEntry,
} from './storeDuplicateTypes'
import {
  buildExpenseDuplicateKeyFromDraft,
  buildExpenseDuplicateKeyFromExisting,
} from './storeDuplicateUtils'

const EMPTY_INDEX_SET_SIZE = 0
const DUPLICATE_SOURCE_NEW_LITERAL: 'new' = DUPLICATE_SOURCE_NEW as 'new'
const DUPLICATE_SOURCE_EXISTING_LITERAL: 'existing' = DUPLICATE_SOURCE_EXISTING as 'existing'
const EMPTY_NORMALIZED_CATEGORY = ''

function normalizeCategory(value: string | undefined): string {
  if (!value) {
    return EMPTY_NORMALIZED_CATEGORY
  }

  return value.trim().toLowerCase()
}

function areCategoriesDuplicateCompatible(
  leftCategory: string | undefined,
  rightCategory: string | undefined,
): boolean {
  const normalizedLeftCategory = normalizeCategory(leftCategory)
  const normalizedRightCategory = normalizeCategory(rightCategory)

  if (!normalizedLeftCategory || !normalizedRightCategory) {
    return true
  }

  return normalizedLeftCategory === normalizedRightCategory
}

export interface StoreExpenseDuplicatesDomain {
  expenseDuplicates: Ref<ExpenseDuplicateEntry[]>
  clearExpenseDuplicates: () => void
  syncExistingExpenses: (existingExpenses: Expense[]) => void
  rebuildExpenseDuplicates: (draftExpenses: NewExpense[]) => void
  recheckDraftExpenseRow: (changedDraftIndex: number, draftExpenses: NewExpense[]) => void
}

function getOrCreateIndexSet(
  draftIndexesByKey: Map<string, Set<number>>,
  duplicateKey: string,
): Set<number> {
  const existingIndexSet = draftIndexesByKey.get(duplicateKey)
  if (existingIndexSet) {
    return existingIndexSet
  }

  const newIndexSet = new Set<number>()
  draftIndexesByKey.set(duplicateKey, newIndexSet)
  return newIndexSet
}

function toSortedDuplicateEntries(
  duplicateEntriesByDraftIndex: Map<number, ExpenseDuplicateEntry>,
): ExpenseDuplicateEntry[] {
  return [...duplicateEntriesByDraftIndex.values()].sort(
    (leftEntry, rightEntry) => leftEntry.draftIndex - rightEntry.draftIndex,
  )
}

export function createStoreExpenseDuplicates(): StoreExpenseDuplicatesDomain {
  const expenseDuplicatesRef = ref<ExpenseDuplicateEntry[]>([])

  const draftDuplicateKeyByIndex = new Map<number, string>()
  const draftIndexesByDuplicateKey = new Map<string, Set<number>>()
  const duplicateEntriesByDraftIndex = new Map<number, ExpenseDuplicateEntry>()
  const existingExpensesByDuplicateKey = new Map<string, Expense[]>()

  const updateExpenseDuplicatesRef = () => {
    expenseDuplicatesRef.value = toSortedDuplicateEntries(duplicateEntriesByDraftIndex)
  }

  const clearExpenseDuplicates = () => {
    draftDuplicateKeyByIndex.clear()
    draftIndexesByDuplicateKey.clear()
    duplicateEntriesByDraftIndex.clear()
    expenseDuplicatesRef.value = []
  }

  const syncExistingExpenses = (existingExpenses: Expense[]) => {
    existingExpensesByDuplicateKey.clear()

    existingExpenses.forEach((expense) => {
      const duplicateKey = buildExpenseDuplicateKeyFromExisting(expense)
      const matchingExpenses = existingExpensesByDuplicateKey.get(duplicateKey)

      if (!matchingExpenses) {
        existingExpensesByDuplicateKey.set(duplicateKey, [expense])
        return
      }

      matchingExpenses.push(expense)
    })
  }

  const removeDraftIndexFromDuplicateKey = (draftIndex: number, duplicateKey: string) => {
    const indexSet = draftIndexesByDuplicateKey.get(duplicateKey)
    if (!indexSet) {
      return
    }

    indexSet.delete(draftIndex)
    if (indexSet.size === EMPTY_INDEX_SET_SIZE) {
      draftIndexesByDuplicateKey.delete(duplicateKey)
    }
  }

  const setDraftIndexDuplicateKey = (draftIndex: number, duplicateKey: string | undefined) => {
    const previousDuplicateKey = draftDuplicateKeyByIndex.get(draftIndex)
    if (previousDuplicateKey) {
      removeDraftIndexFromDuplicateKey(draftIndex, previousDuplicateKey)
      draftDuplicateKeyByIndex.delete(draftIndex)
    }

    if (!duplicateKey) {
      return
    }

    const indexSet = getOrCreateIndexSet(draftIndexesByDuplicateKey, duplicateKey)
    indexSet.add(draftIndex)
    draftDuplicateKeyByIndex.set(draftIndex, duplicateKey)
  }

  const buildDuplicateEntryForDraftIndex = (
    draftIndex: number,
    draftExpenses: NewExpense[],
  ): ExpenseDuplicateEntry | undefined => {
    if (draftIndex < 0 || draftIndex >= draftExpenses.length) {
      return undefined
    }

    const draftDuplicateKey = draftDuplicateKeyByIndex.get(draftIndex)
    if (!draftDuplicateKey) {
      return undefined
    }

    const draftExpense = draftExpenses[draftIndex]
    const draftCategoryId = draftExpense?.category

    const matchingDraftIndexes = draftIndexesByDuplicateKey.get(draftDuplicateKey)
    const otherNewMatches = matchingDraftIndexes
      ? [...matchingDraftIndexes]
          .filter((index) => index !== draftIndex)
          .filter((index) =>
            areCategoriesDuplicateCompatible(draftCategoryId, draftExpenses[index]?.category),
          )
          .map((index) => ({
            source: DUPLICATE_SOURCE_NEW_LITERAL,
            draftIndex: index,
            row: draftExpenses[index],
          }))
      : []

    const existingMatches = (existingExpensesByDuplicateKey.get(draftDuplicateKey) ?? [])
      .filter((expense) => areCategoriesDuplicateCompatible(draftCategoryId, expense.category?.id))
      .map((expense) => ({
        source: DUPLICATE_SOURCE_EXISTING_LITERAL,
        id: expense.id,
        row: expense,
      }))

    const hasNewMatches = otherNewMatches.length > EMPTY_INDEX_SET_SIZE
    const hasExistingMatches = existingMatches.length > EMPTY_INDEX_SET_SIZE

    if (!hasNewMatches && !hasExistingMatches) {
      return undefined
    }

    return {
      type: DUPLICATE_ENTRY_TYPE_EXPENSE,
      duplicateKey: draftDuplicateKey,
      draftIndex,
      draftRow: draftExpense,
      matches: [...otherNewMatches, ...existingMatches],
      isPresentInNew: hasNewMatches,
      isPresentInExisting: hasExistingMatches,
    }
  }

  const rebuildExpenseDuplicates = (draftExpenses: NewExpense[]) => {
    clearExpenseDuplicates()

    draftExpenses.forEach((expense, index) => {
      const duplicateKey = buildExpenseDuplicateKeyFromDraft(expense)
      setDraftIndexDuplicateKey(index, duplicateKey)
    })

    draftExpenses.forEach((_expense, index) => {
      const duplicateEntry = buildDuplicateEntryForDraftIndex(index, draftExpenses)
      if (duplicateEntry) {
        duplicateEntriesByDraftIndex.set(index, duplicateEntry)
      }
    })

    updateExpenseDuplicatesRef()
  }

  const recheckDraftExpenseRow = (changedDraftIndex: number, draftExpenses: NewExpense[]) => {
    if (changedDraftIndex < 0 || changedDraftIndex >= draftExpenses.length) {
      rebuildExpenseDuplicates(draftExpenses)
      return
    }

    const previousDuplicateKey = draftDuplicateKeyByIndex.get(changedDraftIndex)
    const updatedDuplicateKey = buildExpenseDuplicateKeyFromDraft(draftExpenses[changedDraftIndex])
    const affectedDraftIndexes = new Set<number>([changedDraftIndex])

    if (previousDuplicateKey) {
      ;(draftIndexesByDuplicateKey.get(previousDuplicateKey) ?? []).forEach((index) =>
        affectedDraftIndexes.add(index),
      )
    }

    if (updatedDuplicateKey) {
      ;(draftIndexesByDuplicateKey.get(updatedDuplicateKey) ?? []).forEach((index) =>
        affectedDraftIndexes.add(index),
      )
    }

    setDraftIndexDuplicateKey(changedDraftIndex, updatedDuplicateKey)

    affectedDraftIndexes.forEach((draftIndex) => {
      const duplicateEntry = buildDuplicateEntryForDraftIndex(draftIndex, draftExpenses)
      if (duplicateEntry) {
        duplicateEntriesByDraftIndex.set(draftIndex, duplicateEntry)
        return
      }

      duplicateEntriesByDraftIndex.delete(draftIndex)
    })

    updateExpenseDuplicatesRef()
  }

  return {
    expenseDuplicates: expenseDuplicatesRef,
    clearExpenseDuplicates,
    syncExistingExpenses,
    rebuildExpenseDuplicates,
    recheckDraftExpenseRow,
  }
}
