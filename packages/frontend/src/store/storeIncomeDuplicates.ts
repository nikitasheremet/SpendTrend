import { ref, type Ref } from 'vue'
import type { Income, NewIncome } from '@/types/income/income'
import {
  DUPLICATE_ENTRY_TYPE_INCOME,
  DUPLICATE_SOURCE_EXISTING,
  DUPLICATE_SOURCE_NEW,
  type IncomeDuplicateEntry,
} from './storeDuplicateTypes'
import {
  buildIncomeDuplicateKeyFromDraft,
  buildIncomeDuplicateKeyFromExisting,
} from './storeDuplicateUtils'

const EMPTY_INDEX_SET_SIZE = 0
const DUPLICATE_SOURCE_NEW_LITERAL: 'new' = DUPLICATE_SOURCE_NEW as 'new'
const DUPLICATE_SOURCE_EXISTING_LITERAL: 'existing' = DUPLICATE_SOURCE_EXISTING as 'existing'

export interface StoreIncomeDuplicatesDomain {
  incomeDuplicates: Ref<IncomeDuplicateEntry[]>
  clearIncomeDuplicates: () => void
  syncExistingIncomes: (existingIncomes: Income[]) => void
  rebuildIncomeDuplicates: (draftIncomes: NewIncome[]) => void
  recheckDraftIncomeRow: (changedDraftIndex: number, draftIncomes: NewIncome[]) => void
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
  duplicateEntriesByDraftIndex: Map<number, IncomeDuplicateEntry>,
): IncomeDuplicateEntry[] {
  return [...duplicateEntriesByDraftIndex.values()].sort(
    (leftEntry, rightEntry) => leftEntry.draftIndex - rightEntry.draftIndex,
  )
}

export function createStoreIncomeDuplicates(): StoreIncomeDuplicatesDomain {
  const incomeDuplicatesRef = ref<IncomeDuplicateEntry[]>([])

  const draftDuplicateKeyByIndex = new Map<number, string>()
  const draftIndexesByDuplicateKey = new Map<string, Set<number>>()
  const duplicateEntriesByDraftIndex = new Map<number, IncomeDuplicateEntry>()
  const existingIncomesByDuplicateKey = new Map<string, Income[]>()

  const updateIncomeDuplicatesRef = () => {
    incomeDuplicatesRef.value = toSortedDuplicateEntries(duplicateEntriesByDraftIndex)
  }

  const clearIncomeDuplicates = () => {
    draftDuplicateKeyByIndex.clear()
    draftIndexesByDuplicateKey.clear()
    duplicateEntriesByDraftIndex.clear()
    incomeDuplicatesRef.value = []
  }

  const syncExistingIncomes = (existingIncomes: Income[]) => {
    existingIncomesByDuplicateKey.clear()

    existingIncomes.forEach((income) => {
      const duplicateKey = buildIncomeDuplicateKeyFromExisting(income)
      const matchingIncomes = existingIncomesByDuplicateKey.get(duplicateKey)

      if (!matchingIncomes) {
        existingIncomesByDuplicateKey.set(duplicateKey, [income])
        return
      }

      matchingIncomes.push(income)
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
    draftIncomes: NewIncome[],
  ): IncomeDuplicateEntry | undefined => {
    if (draftIndex < 0 || draftIndex >= draftIncomes.length) {
      return undefined
    }

    const draftDuplicateKey = draftDuplicateKeyByIndex.get(draftIndex)
    if (!draftDuplicateKey) {
      return undefined
    }

    const matchingDraftIndexes = draftIndexesByDuplicateKey.get(draftDuplicateKey)
    const otherNewMatches = matchingDraftIndexes
      ? [...matchingDraftIndexes]
          .filter((index) => index !== draftIndex)
          .map((index) => ({
            source: DUPLICATE_SOURCE_NEW_LITERAL,
            draftIndex: index,
            row: draftIncomes[index],
          }))
      : []

    const existingMatches = (existingIncomesByDuplicateKey.get(draftDuplicateKey) ?? []).map(
      (income) => ({
        source: DUPLICATE_SOURCE_EXISTING_LITERAL,
        id: income.id,
        row: income,
      }),
    )

    const hasNewMatches = otherNewMatches.length > EMPTY_INDEX_SET_SIZE
    const hasExistingMatches = existingMatches.length > EMPTY_INDEX_SET_SIZE

    if (!hasNewMatches && !hasExistingMatches) {
      return undefined
    }

    return {
      type: DUPLICATE_ENTRY_TYPE_INCOME,
      duplicateKey: draftDuplicateKey,
      draftIndex,
      draftRow: draftIncomes[draftIndex],
      matches: [...otherNewMatches, ...existingMatches],
      isPresentInNew: hasNewMatches,
      isPresentInExisting: hasExistingMatches,
    }
  }

  const rebuildIncomeDuplicates = (draftIncomes: NewIncome[]) => {
    clearIncomeDuplicates()

    draftIncomes.forEach((income, index) => {
      const duplicateKey = buildIncomeDuplicateKeyFromDraft(income)
      setDraftIndexDuplicateKey(index, duplicateKey)
    })

    draftIncomes.forEach((_income, index) => {
      const duplicateEntry = buildDuplicateEntryForDraftIndex(index, draftIncomes)
      if (duplicateEntry) {
        duplicateEntriesByDraftIndex.set(index, duplicateEntry)
      }
    })

    updateIncomeDuplicatesRef()
  }

  const recheckDraftIncomeRow = (changedDraftIndex: number, draftIncomes: NewIncome[]) => {
    if (changedDraftIndex < 0 || changedDraftIndex >= draftIncomes.length) {
      rebuildIncomeDuplicates(draftIncomes)
      return
    }

    const previousDuplicateKey = draftDuplicateKeyByIndex.get(changedDraftIndex)
    const updatedDuplicateKey = buildIncomeDuplicateKeyFromDraft(draftIncomes[changedDraftIndex])
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
      const duplicateEntry = buildDuplicateEntryForDraftIndex(draftIndex, draftIncomes)
      if (duplicateEntry) {
        duplicateEntriesByDraftIndex.set(draftIndex, duplicateEntry)
        return
      }

      duplicateEntriesByDraftIndex.delete(draftIndex)
    })

    updateIncomeDuplicatesRef()
  }

  return {
    incomeDuplicates: incomeDuplicatesRef,
    clearIncomeDuplicates,
    syncExistingIncomes,
    rebuildIncomeDuplicates,
    recheckDraftIncomeRow,
  }
}
